import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { privasi } from '../data/privasi'

export default function Privasi() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="nb btn mb-8 w-fit" style={{ '--c': '#fff' }}><ArrowLeft className="size-5" />Kembali ke beranda</Link>
      <h1 className="text-4xl font-bold sm:text-5xl">Kebijakan <span className="tanda">privasi</span></h1>
      <p className="mt-3 text-sm font-extrabold">Diperbarui: {privasi.diperbarui}</p>
      <p className="mt-4 text-lg">{privasi.pembuka}</p>
      <div className="mt-8 grid gap-6">
        {privasi.bagian.map((b, i) => (
          <section key={b.judul} className="nb p-6" style={{ '--c': '#fff', '--r': '16px' }}>
            <h2 className="text-2xl font-bold">{i + 1}. {b.judul}</h2>
            {b.teks && <p className="mt-3">{b.teks}</p>}
            {b.daftar && <ul className="mt-3 grid list-disc gap-2 pl-6">{b.daftar.map((d) => <li key={d}>{d}</li>)}</ul>}
            {b.catatan && <p className="mt-3 font-semibold">{b.catatan}</p>}
            {b.teksAkhir && <p className="mt-3">{b.teksAkhir}</p>}
          </section>
        ))}
      </div>
    </main>
  )
}
