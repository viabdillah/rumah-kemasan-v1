import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail,
} from 'firebase/auth'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { auth } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'

const pesanError = {
  'auth/invalid-credential': 'Email atau kata sandi salah.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
  'auth/weak-password': 'Kata sandi terlalu lemah. Minimal 6 karakter.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.',
  'auth/popup-closed-by-user': 'Jendela login Google ditutup sebelum selesai.',
  'auth/popup-blocked': 'Pop-up diblokir browser. Izinkan pop-up untuk situs ini.',
  'auth/network-request-failed': 'Koneksi internet bermasalah.',
  'auth/unauthorized-domain': 'Alamat situs ini belum diizinkan di Firebase. Buka lewat http://localhost:5173 atau tambahkan domain di Authentication > Settings > Authorized domains.',
  'auth/operation-not-allowed': 'Metode masuk ini belum diaktifkan di Firebase (Authentication > Sign-in method).',
  'auth/invalid-api-key': 'API key Firebase salah atau kosong. Periksa landing/.env lalu jalankan ulang npm run dev.',
  'auth/api-key-not-valid.-please-pass-a-valid-api-key.': 'API key Firebase salah. Periksa landing/.env lalu jalankan ulang npm run dev.',
  'auth/configuration-not-found': 'Authentication belum diaktifkan di proyek Firebase (klik Get started).',
  'auth/cancelled-popup-request': 'Jendela login Google terbuka dua kali. Klik sekali saja lalu tunggu.',
  'lokal/beda-sandi': 'Kata sandi dan pengulangannya tidak sama.',
  'lokal/email-kosong': 'Isi email dulu, lalu klik Lupa kata sandi.',
}

function Kolom({ ikon: I, children }) {
  return (
    <label className="relative block">
      <I className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 opacity-60" />
      {children}
    </label>
  )
}

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
)

export default function Masuk() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'daftar' ? 'daftar' : 'masuk'
  const { user, siap } = useAuth()
  const [f, setF] = useState({ nama: '', email: '', sandi: '', ulang: '' })
  const [lihat, setLihat] = useState(false)
  const [sibuk, setSibuk] = useState(false)
  const [pesan, setPesan] = useState(null)

  if (siap && user) return <Navigate to="/dashboard" replace />

  const ubah = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const pilihTab = (t) => { setParams({ tab: t }); setPesan(null) }

  const jalankan = async (fn) => {
    setSibuk(true)
    setPesan(null)
    try { await fn() } catch (e) {
      console.error(e)
      setPesan({ jenis: 'galat', teks: pesanError[e.code] || `Terjadi kesalahan (${e.code || e.message}).` })
    } finally { setSibuk(false) }
  }

  const kirim = (e) => {
    e.preventDefault()
    jalankan(async () => {
      if (tab === 'masuk') return signInWithEmailAndPassword(auth, f.email, f.sandi)
      if (f.sandi !== f.ulang) throw { code: 'lokal/beda-sandi' }
      const { user: baru } = await createUserWithEmailAndPassword(auth, f.email, f.sandi)
      await updateProfile(baru, { displayName: f.nama.trim() })
      await sendEmailVerification(baru)
    })
  }

  const lupa = () => jalankan(async () => {
    if (!f.email) throw { code: 'lokal/email-kosong' }
    await sendPasswordResetEmail(auth, f.email)
    setPesan({ jenis: 'ok', teks: 'Jika email terdaftar, tautan reset kata sandi sudah dikirim. Cek juga folder spam.' })
  })

  const google = () => jalankan(() => signInWithPopup(auth, new GoogleAuthProvider()))

  return (
    <main className="grid min-h-svh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" aria-label="Kembali ke beranda">
          <img src="/images/logo.svg" alt="Rumah Kemasan SINTESA Lebak" className="mx-auto mb-6 h-14 w-auto" />
        </Link>
        <div className="nb p-6 sm:p-8" style={{ '--c': '#fff', '--r': '2.5rem' }}>
          <div role="tablist" className="nb grid grid-cols-2 gap-2 p-1.5" style={{ '--c': 'var(--langit)', '--r': '999px' }}>
            {[['masuk', 'Masuk'], ['daftar', 'Daftar']].map(([t, nama]) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => pilihTab(t)}
                className={`btn justify-center ${tab === t ? 'nb' : ''}`} style={{ '--c': 'var(--biru)' }}>{nama}</button>
            ))}
          </div>

          <h1 className="mt-6 text-3xl font-bold">{tab === 'masuk' ? 'Selamat datang kembali' : 'Daftarkan usaha Anda'}</h1>

          <form onSubmit={kirim} className="mt-5 grid gap-4">
            {tab === 'daftar' && (
              <Kolom ikon={User}><input className="input pl-12" placeholder="Nama lengkap" value={f.nama} onChange={ubah('nama')} required autoComplete="name" /></Kolom>
            )}
            <Kolom ikon={Mail}><input className="input pl-12" type="email" placeholder="Email" value={f.email} onChange={ubah('email')} required autoComplete="email" /></Kolom>
            <Kolom ikon={Lock}>
              <input className="input pl-12 pr-12" type={lihat ? 'text' : 'password'} placeholder="Kata sandi (min. 6 karakter)" minLength={6}
                value={f.sandi} onChange={ubah('sandi')} required autoComplete={tab === 'masuk' ? 'current-password' : 'new-password'} />
              <button type="button" onClick={() => setLihat(!lihat)} aria-label={lihat ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-4 top-1/2 -translate-y-1/2">{lihat ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>
            </Kolom>
            {tab === 'daftar' && (
              <Kolom ikon={Lock}><input className="input pl-12" type={lihat ? 'text' : 'password'} placeholder="Ulangi kata sandi" value={f.ulang} onChange={ubah('ulang')} required autoComplete="new-password" /></Kolom>
            )}

            {pesan && (
              <p role="alert" className="nb px-4 py-3 text-sm font-bold" style={{ '--c': pesan.jenis === 'ok' ? 'var(--hijau)' : 'var(--jingga)', '--r': '1.25rem' }}>{pesan.teks}</p>
            )}

            <button type="submit" disabled={sibuk} className="nb btn w-full justify-center disabled:opacity-60" style={{ '--c': 'var(--biru)' }}>
              {sibuk ? 'Memproses...' : tab === 'masuk' ? 'Masuk' : 'Daftar'}
            </button>
            {tab === 'masuk' && (
              <button type="button" onClick={lupa} disabled={sibuk} className="text-sm font-bold underline">Lupa kata sandi?</button>
            )}
          </form>

          <p className="my-5 text-center text-sm font-bold opacity-60">atau</p>
          <button type="button" onClick={google} disabled={sibuk} className="nb btn w-full justify-center disabled:opacity-60" style={{ '--c': '#fff' }}>
            <GoogleG />Lanjutkan dengan Google
          </button>
        </div>
        <p className="mt-6 text-center text-sm"><Link to="/" className="font-bold underline">Kembali ke beranda</Link></p>
      </div>
    </main>
  )
}
