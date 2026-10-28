import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const tautan = [['Tentang', '#tentang'], ['Visi dan misi', '#visi-misi'], ['Layanan', '#layanan'], ['Alur', '#alur'], ['Produksi', '#produksi'], ['Konsultasi', '#konsultasi']]

function Akun({ user, keluar }) {
  const nama = user.displayName || user.email
  return (
    <div className="flex items-center gap-2">
      <Link to="/dashboard" title={nama} className="clay btn" style={{ '--c': '#fff' }}>
        {user.photoURL
          ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="size-7 rounded-full" />
          : <span className="grid size-7 place-items-center rounded-full font-extrabold" style={{ background: 'var(--toska)' }}>{nama[0].toUpperCase()}</span>}
        Profil UMKM
      </Link>
      <button onClick={keluar} aria-label="Keluar" title="Keluar" className="clay btn" style={{ '--c': '#fff' }}><LogOut className="size-4" /></button>
    </div>
  )
}

function Tamu() {
  return (
    <div className="flex gap-2">
      <a href="/masuk" className="clay btn" style={{ '--c': '#fff' }}><LogIn className="size-4" />Masuk</a>
      <a href="/daftar" className="clay btn" style={{ '--c': 'var(--biru)' }}><UserPlus className="size-4" />Daftar</a>
    </div>
  )
}

export default function Navbar() {
  const [buka, setBuka] = useState(false)
  const { user, siap, keluar } = useAuth()
  // Selama Firebase memeriksa sesi, jangan tampilkan tombol apa pun agar tidak berkedip.
  const akun = !siap ? null : user ? <Akun user={user} keluar={keluar} /> : <Tamu />
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3">
      <nav className="clay mx-auto flex max-w-6xl items-center justify-between px-4 py-2" style={{ '--c': 'rgb(255 255 255 / .88)', '--r': '1.5rem' }}>
        <a href="#beranda" aria-label="Rumah Kemasan SINTESA Lebak">
          <img src="/images/logo.svg" alt="Logo Rumah Kemasan SINTESA Lebak" className="h-10 w-auto" />
        </a>
        <ul className="hidden gap-5 text-sm font-extrabold md:flex">
          {tautan.map(([nama, href]) => <li key={href}><a href={href} className="hover:underline">{nama}</a></li>)}
        </ul>
        <div className="hidden md:block">{akun}</div>
        <button className="clay p-2 md:hidden" style={{ '--r': '1rem' }} onClick={() => setBuka(!buka)} aria-label="Menu" aria-expanded={buka}>
          {buka ? <X /> : <Menu />}
        </button>
      </nav>
      {buka && (
        <div className="clay pop mx-auto mt-2 max-w-6xl p-4 md:hidden" style={{ '--r': '1.5rem' }}>
          <ul className="grid gap-3 font-extrabold">
            {tautan.map(([nama, href]) => <li key={href}><a href={href} onClick={() => setBuka(false)}>{nama}</a></li>)}
          </ul>
          <div className="mt-4">{akun}</div>
        </div>
      )}
    </header>
  )
}
