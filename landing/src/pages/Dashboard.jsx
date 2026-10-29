import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { sendEmailVerification } from 'firebase/auth'
import { LogOut, Pencil, Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { kecamatanLebak, luarLebak, jenisProduk, layananList, legalitasUsaha, legalitasProduk, platformSosmed, maksProduk } from '../data/umkm'
import { kosong, produkKosong, validasi, muat, simpan } from '../lib/umkm'

const warnaError = { color: '#b4410f' }

function Isian({ label, error, bantuan, children }) {
  return (
    <label className="grid gap-1.5">
      <span className="font-extrabold">{label}</span>
      {children}
      {bantuan && <span className="text-sm opacity-70">{bantuan}</span>}
      {error && <span role="alert" className="text-sm font-bold" style={warnaError}>{error}</span>}
    </label>
  )
}

const teksLegal = (daftar, legalitas, nomor) =>
  daftar.filter((l) => legalitas[l.kode]).map((l) => (nomor[l.kode] ? `${l.nama} (${nomor[l.kode]})` : l.nama)).join(', ') || 'Belum ada'

function Ringkasan({ d, onUbah }) {
  const sos = Object.entries(d.sosmed).filter(([, v]) => v).map(([k, v]) => [platformSosmed.find((p) => p.kode === k)?.nama ?? k, v])
  const baris = [
    ['Nama usaha', d.namaUsaha], ['Pemilik', d.namaPemilik], ['WhatsApp', d.whatsapp], ['Kecamatan', d.kecamatan],
    ['Legalitas usaha', teksLegal(legalitasUsaha, d.legalitas, d.nomor)],
    ...d.produk.flatMap((p, i) => {
      const no = d.produk.length > 1 ? ` ${i + 1}` : ''
      return [[`Produk${no}`, `${p.nama} (${p.jenis})`], [`Legalitas produk${no}`, teksLegal(legalitasProduk, p.legalitas, p.nomor)]]
    }),
    ['Kebutuhan layanan', d.layanan.join(', ')], ...(sos.length ? sos : [['Media sosial', '-']]), ['Catatan', d.catatan || '-'],
  ]
  return (
    <>
      <dl className="mt-5 grid gap-3">
        {baris.map(([k, v]) => (
          <div key={k} className="clay px-5 py-3" style={{ '--c': '#fff', '--r': '1.25rem' }}>
            <dt className="text-sm font-bold opacity-70">{k}</dt>
            <dd className="font-semibold break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <button onClick={onUbah} className="clay btn mt-5" style={{ '--c': 'var(--toska)' }}><Pencil className="size-5" />Ubah data</button>
    </>
  )
}

export default function Dashboard() {
  const { user, siap, keluar } = useAuth()
  const [data, setData] = useState(null)
  const [memuat, setMemuat] = useState(true)
  const [edit, setEdit] = useState(false)
  const [f, setF] = useState(kosong())
  const [err, setErr] = useState({})
  const [sibuk, setSibuk] = useState(false)
  const [info, setInfo] = useState('')
  const [galatMuat, setGalatMuat] = useState('')
  const [galatSimpan, setGalatSimpan] = useState('')

  useEffect(() => {
    if (!user) return
    muat()
      .then((d) => {
        setData(d)
        setF(d ?? kosong(user.displayName || ''))
        setEdit(!d)
      })
      .catch((e) => setGalatMuat(e.message))
      .finally(() => setMemuat(false))
  }, [user])

  if (!siap || (user && memuat)) return <p className="p-8 font-bold">Memuat...</p>
  if (!user) return <Navigate to="/masuk" replace />
  // Jika data gagal dimuat, jangan tampilkan formulir kosong: pengguna bisa tanpa sengaja menimpa data yang sudah ada.
  if (galatMuat) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="clay p-8" style={{ '--c': '#fff', '--r': '2.5rem' }}>
          <h1 className="text-2xl font-bold">Data belum bisa dimuat</h1>
          <p className="mt-2" role="alert">{galatMuat}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={() => window.location.reload()} className="clay btn" style={{ '--c': 'var(--biru)' }}>Coba lagi</button>
            <button onClick={keluar} className="clay btn" style={{ '--c': '#fff' }}><LogOut className="size-5" />Keluar</button>
          </div>
        </div>
      </main>
    )
  }

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const ubahBersarang = (grup, k, nilai) => setF({ ...f, [grup]: { ...f[grup], [k]: nilai } })
  const gantiLayanan = (nama) => setF({ ...f, layanan: f.layanan.includes(nama) ? f.layanan.filter((x) => x !== nama) : [...f.layanan, nama] })

  const ubahProduk = (i, k, nilai) => setF({ ...f, produk: f.produk.map((p, n) => (n === i ? { ...p, [k]: nilai } : p)) })
  const ubahLegalProduk = (i, kode, nilai) => ubahProduk(i, 'legalitas', { ...f.produk[i].legalitas, [kode]: nilai })
  const ubahNomorProduk = (i, kode, nilai) => ubahProduk(i, 'nomor', { ...f.produk[i].nomor, [kode]: nilai })
  const tambahProduk = () => setF({ ...f, produk: [...f.produk, produkKosong()] })
  const hapusProduk = (i) => setF({ ...f, produk: f.produk.filter((_, n) => n !== i) })
  const hapusSosmed = (kode) => { const { [kode]: _hapus, ...sisa } = f.sosmed; setF({ ...f, sosmed: sisa }) }

  const kirim = async (e) => {
    e.preventDefault()
    const er = validasi(f)
    setErr(er)
    if (Object.keys(er).length) return
    setSibuk(true)
    setGalatSimpan('')
    try {
      const tersimpan = await simpan(f)
      setData(tersimpan); setF(tersimpan); setEdit(false)
    } catch (e) {
      setGalatSimpan(e.message)
    } finally {
      setSibuk(false)
    }
  }

  const kirimUlang = async () => {
    try { await sendEmailVerification(user); setInfo('Email konfirmasi dikirim ulang. Cek kotak masuk dan folder spam.') }
    catch { setInfo('Gagal mengirim. Tunggu beberapa menit lalu coba lagi.') }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="clay p-6 sm:p-8" style={{ '--c': '#fff', '--r': '2.5rem' }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Profil UMKM</h1>
            <p className="mt-1 text-sm">Masuk sebagai {user.email}</p>
          </div>
          <span className="clay px-4 py-2 text-sm font-extrabold" style={{ '--c': 'var(--matahari)', '--r': '999px' }}>{data?.status ?? 'Belum terdaftar'}</span>
        </div>

        {!user.emailVerified && (
          <div className="clay mt-5 p-4" style={{ '--c': 'var(--matahari)', '--r': '1.5rem' }}>
            <p className="font-bold">Email belum dikonfirmasi.</p>
            <p className="text-sm">Klik tautan di email konfirmasi, lalu muat ulang halaman ini.</p>
            <button onClick={kirimUlang} className="mt-2 text-sm font-bold underline">Kirim ulang email</button>
            {info && <p className="mt-2 text-sm">{info}</p>}
          </div>
        )}

        {!edit && data ? <Ringkasan d={data} onUbah={() => { setF(data); setErr({}); setEdit(true) }} /> : (
          <form onSubmit={kirim} className="mt-5 grid gap-5" noValidate>
            <h2 className="text-xl font-semibold">{data ? 'Ubah data UMKM' : 'Lengkapi data UMKM'}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Isian label="Nama usaha" error={err.namaUsaha}><input className="input" value={f.namaUsaha} onChange={set('namaUsaha')} autoComplete="organization" /></Isian>
              <Isian label="Nama pemilik" error={err.namaPemilik}><input className="input" value={f.namaPemilik} onChange={set('namaPemilik')} autoComplete="name" /></Isian>
            </div>
            <Isian label="Nomor WhatsApp" error={err.whatsapp} bantuan="Dipakai tim Rumah Kemasan untuk menghubungi Anda. Contoh: 081234567890.">
              <input className="input" type="tel" inputMode="tel" value={f.whatsapp} onChange={set('whatsapp')} autoComplete="tel" />
            </Isian>
            <Isian label="Kecamatan" error={err.kecamatan}>
              <select className="input" value={f.kecamatan} onChange={set('kecamatan')}>
                <option value="">Pilih kecamatan</option>
                {[...kecamatanLebak, luarLebak].map((k) => <option key={k}>{k}</option>)}
              </select>
            </Isian>

            <fieldset className="grid gap-3">
              <legend className="font-extrabold">Produk</legend>
              {f.produk.map((p, i) => (
                <div key={i} className="clay grid gap-4 p-4" style={{ '--c': 'var(--langit)', '--r': '1.5rem' }}>
                  <div className="grid gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-start">
                    <Isian label={f.produk.length > 1 ? `Nama produk ${i + 1}` : 'Nama produk'} error={err[`produk${i}nama`]}>
                      <input className="input" value={p.nama} onChange={(e) => ubahProduk(i, 'nama', e.target.value)} />
                    </Isian>
                    <Isian label="Jenis" error={err[`produk${i}jenis`]}>
                      <select className="input" value={p.jenis} onChange={(e) => ubahProduk(i, 'jenis', e.target.value)}>
                        <option value="">Pilih jenis</option>
                        {jenisProduk.map((j) => <option key={j}>{j}</option>)}
                      </select>
                    </Isian>
                    {f.produk.length > 1 && (
                      <button type="button" onClick={() => hapusProduk(i)} aria-label={`Hapus produk ${i + 1}`} className="clay grid size-10 place-items-center sm:mt-8" style={{ '--c': '#fff', '--r': '999px' }}><X className="size-5" /></button>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-extrabold">Legalitas produk ini (boleh dikosongkan)</p>
                    {legalitasProduk.map((l) => (
                      <div key={l.kode} className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:items-center">
                        <label className="flex items-center gap-3 font-semibold">
                          <input type="checkbox" className="size-5 accent-sky-500" checked={p.legalitas[l.kode]} onChange={(e) => ubahLegalProduk(i, l.kode, e.target.checked)} />{l.nama}
                        </label>
                        {p.legalitas[l.kode] && (
                          <input className="input" aria-label={`Nomor ${l.nama}`} placeholder={`Nomor ${l.nama} (boleh dikosongkan)`} value={p.nomor[l.kode]} onChange={(e) => ubahNomorProduk(i, l.kode, e.target.value)} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {f.produk.length < maksProduk && (
                <button type="button" onClick={tambahProduk} className="clay btn w-fit" style={{ '--c': '#fff' }}><Plus className="size-5" />Tambah produk</button>
              )}
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="font-extrabold">Legalitas usaha</legend>
              <p className="text-sm opacity-70">NIB berlaku untuk seluruh usaha. Nomornya boleh diisi atau dikosongkan. PIRT, BPOM, dan Halal diisi pada tiap produk di atas.</p>
              {legalitasUsaha.map((l) => (
                <div key={l.kode} className="grid gap-2 sm:grid-cols-[11rem_1fr] sm:items-center">
                  <label className="flex items-center gap-3 font-semibold">
                    <input type="checkbox" className="size-5 accent-sky-500" checked={f.legalitas[l.kode]} onChange={(e) => ubahBersarang('legalitas', l.kode, e.target.checked)} />{l.nama}
                  </label>
                  {f.legalitas[l.kode] && (
                    <input className="input" aria-label={`Nomor ${l.nama}`} placeholder={`Nomor ${l.nama} (boleh dikosongkan)`} value={f.nomor[l.kode]} onChange={(e) => ubahBersarang('nomor', l.kode, e.target.value)} />
                  )}
                </div>
              ))}
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="font-extrabold">Kebutuhan layanan</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {layananList.map((n) => (
                  <label key={n} className="flex items-center gap-3 font-semibold">
                    <input type="checkbox" className="size-5 accent-sky-500" checked={f.layanan.includes(n)} onChange={() => gantiLayanan(n)} />{n}
                  </label>
                ))}
              </div>
              {err.layanan && <span role="alert" className="text-sm font-bold" style={warnaError}>{err.layanan}</span>}
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="font-extrabold">Media sosial dan toko online (opsional)</legend>
              <p className="text-sm opacity-70">Klik platform untuk menambahkannya. Boleh berupa tautan atau nama akun.</p>
              {Object.keys(f.sosmed).map((kode) => {
                const pl = platformSosmed.find((x) => x.kode === kode)
                return (
                  <div key={kode} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-2">
                    <span className="font-extrabold">{pl?.nama ?? kode}</span>
                    <input className="input" aria-label={pl?.nama} placeholder={pl?.contoh} value={f.sosmed[kode]} onChange={(e) => setF({ ...f, sosmed: { ...f.sosmed, [kode]: e.target.value } })} />
                    <button type="button" onClick={() => hapusSosmed(kode)} aria-label={`Hapus ${pl?.nama}`} className="clay grid size-10 place-items-center" style={{ '--c': '#fff', '--r': '999px' }}><X className="size-5" /></button>
                  </div>
                )
              })}
              <div className="flex flex-wrap gap-2">
                {platformSosmed.filter((x) => !(x.kode in f.sosmed)).map((x) => (
                  <button key={x.kode} type="button" onClick={() => setF({ ...f, sosmed: { ...f.sosmed, [x.kode]: '' } })} className="clay btn py-2 text-sm" style={{ '--c': '#fff' }}><Plus className="size-4" />{x.nama}</button>
                ))}
              </div>
            </fieldset>
            <Isian label="Catatan tambahan (opsional)"><textarea className="input" rows={3} value={f.catatan} onChange={set('catatan')} /></Isian>

            <div className="grid gap-1.5">
              <label className="flex items-start gap-3 font-semibold">
                <input type="checkbox" className="mt-1 size-5 shrink-0 accent-sky-500" checked={f.setuju} onChange={(e) => setF({ ...f, setuju: e.target.checked })} />
                Saya setuju data ini dipakai Rumah Kemasan SINTESA Lebak untuk layanan kemasan dan dihubungi lewat WhatsApp.
              </label>
              {err.setuju && <span role="alert" className="text-sm font-bold" style={warnaError}>{err.setuju}</span>}
            </div>

            {Object.keys(err).length > 0 && <p role="alert" className="clay px-4 py-3 text-sm font-bold" style={{ '--c': 'var(--jingga)', '--r': '1.25rem' }}>Ada isian yang perlu diperbaiki. Periksa tulisan di bawah kolom yang bermasalah.</p>}

            {galatSimpan && <p role="alert" className="clay px-4 py-3 text-sm font-bold" style={{ '--c': 'var(--jingga)', '--r': '1.25rem' }}>Gagal menyimpan: {galatSimpan}</p>}

            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={sibuk} className="clay btn disabled:opacity-60" style={{ '--c': 'var(--biru)' }}>{sibuk ? 'Menyimpan...' : 'Simpan data'}</button>
              {data && <button type="button" onClick={() => setEdit(false)} className="clay btn" style={{ '--c': '#fff' }}>Batal</button>}
            </div>
          </form>
        )}

        <div className="mt-8 flex flex-wrap gap-3 border-t pt-5" style={{ borderColor: 'rgb(38 51 77 / .12)' }}>
          <Link to="/" className="clay btn" style={{ '--c': '#fff' }}>Ke beranda</Link>
          <button onClick={keluar} className="clay btn" style={{ '--c': '#fff' }}><LogOut className="size-5" />Keluar</button>
        </div>
      </div>
    </main>
  )
}
