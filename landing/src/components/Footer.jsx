import { ArrowUp, MessageCircle } from 'lucide-react'
import { kontak, mitra } from '../data/content'
import { normalisasiWa } from '../lib/umkm'
import { LogoDraf } from './LogoDraf'

const nomor = normalisasiWa(kontak.whatsapp || '')
const tampil = nomor.startsWith('62') ? `0${nomor.slice(2)}` : nomor
const sapaan = encodeURIComponent('Halo Rumah Kemasan SINTESA Lebak, saya ingin bertanya.')

export default function Footer() {
  return (
    <footer className="px-5 pb-28 pt-12" style={{ background: 'var(--tinta)', color: '#fff', '--sh': 'var(--matahari)' }}>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold">Didukung oleh</h2>
        <ul className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {mitra.map((m) => (
            <li key={m.nama} className="nb flex flex-col items-center gap-3 p-4 text-center" style={{ '--c': '#fff', '--r': '14px', color: 'var(--tinta)' }}>
              {m.gambar
                ? <img src={m.gambar} alt={`Logo ${m.nama}`} className="h-20 w-auto object-contain" />
                : <LogoDraf singkatan={m.singkatan} warna={m.warna} />}
              <span className="text-sm font-extrabold">{m.nama}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t-[3px] border-white pt-6">
          <p className="max-w-md">© 2026 Rumah Kemasan SINTESA Lebak. Pusat Layanan Kemasan Kabupaten Lebak.</p>
          <div className="flex flex-wrap gap-4">
            {nomor && (
              <a href={`https://wa.me/${nomor}?text=${sapaan}`} target="_blank" rel="noopener noreferrer" className="nb btn" style={{ '--c': 'var(--hijau)', color: 'var(--tinta)' }}>
                <MessageCircle className="size-5" />WhatsApp {tampil}
              </a>
            )}
            <a href="#beranda" className="nb btn" style={{ '--c': 'var(--matahari)', color: 'var(--tinta)' }}><ArrowUp className="size-5" />Ke atas</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
