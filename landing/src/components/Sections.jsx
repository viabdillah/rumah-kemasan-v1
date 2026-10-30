import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfil } from '../context/ProfilContext'
import { profilLengkap } from '../lib/wa'
import { MessagesSquare, GraduationCap, HandHelping, Printer, ClipboardList, Palette, Factory, LogIn, UserPlus, Building2, BadgeCheck, MapPin, Users, TrendingUp, Globe, Info, Package } from 'lucide-react'
import { identitas, tentang, fungsi, visiMisi, layanan, alur, produksi } from '../data/content'

const ikon = { MessagesSquare, GraduationCap, HandHelping, Printer, ClipboardList, Palette, Factory, Building2, BadgeCheck, MapPin, Users, TrendingUp, Globe, Info, Package }

// Satu section = satu layar penuh. Menghitung --py untuk efek parallax.
function Screen({ id, layers, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      el.style.setProperty('--py', r.top + r.height / 2 - window.innerHeight / 2)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <section id={id} ref={ref} className="screen">
      {layers}
      <div className="relative z-10 mx-auto w-full max-w-5xl">{children}</div>
    </section>
  )
}

// Tombol ajakan: berubah menjadi "Buka profil UMKM" setelah pengguna masuk.
function AjakDaftar({ denganMasuk = false }) {
  const { user, siap } = useAuth()
  const { data, status } = useProfil()
  if (!siap) return null
  if (user) {
    const lengkap = status === 'siap' && profilLengkap(data)
    return (
      <>
        <Link to="/dashboard" className="nb btn" style={{ '--c': lengkap ? '#fff' : 'var(--biru)' }}><Building2 className="size-5" />{lengkap ? 'Buka profil UMKM' : 'Lengkapi data UMKM'}</Link>
      </>
    )
  }
  return (
    <>
      <a href="/daftar" className="nb btn" style={{ '--c': 'var(--biru)' }}><UserPlus className="size-5" />Daftar UMKM</a>
      {denganMasuk && <a href="/masuk" className="nb btn" style={{ '--c': '#fff' }}><LogIn className="size-5" />Sudah terdaftar? Masuk</a>}
    </>
  )
}

// Bentuk geometris tebal sebagai lapisan parallax. Yang berada di tepi (-left-/-right-) hanya mengintip
// di margin kiri/kanan, jadi tidak pernah menimpa teks. Disembunyikan di layar kecil.
const INTIP = 'clamp(12px, calc((100vw - 64rem) / 2 - 10px), 80px)'

function Blob({ warna, ukuran, speed, posisi, bentuk = 'lingkaran' }) {
  const w = ukuran * 0.7
  const gaya = { lingkaran: 'rounded-full', kotak: 'rounded-lg', berlian: 'rotate-45 rounded-lg' }[bentuk]
  const sisi = posisi.match(/-(left|right)-/)?.[1]
  const dalam = bentuk === 'berlian' ? w * 0.707 : w / 2 // jarak pusat ke sisi yang menghadap isi halaman
  const tepi = sisi ? { [sisi]: `calc(${-(w / 2 + dalam)}px + ${INTIP})` } : {}
  return (
    <div aria-hidden className={`parallax absolute hidden border-[3px] border-[#111] sm:block ${gaya} ${posisi.replace(/-(left|right)-\S+/, '')}`}
      style={{ '--speed': speed, width: w, height: w, background: warna, boxShadow: '6px 6px 0 #111', ...tepi }} />
  )
}

export function Hero() {
  return (
    <Screen id="beranda" layers={<>
      <Blob warna="var(--biru)" ukuran={380} speed={0.35} posisi="left-[52%] top-24"  bentuk="lingkaran" />
      <Blob warna="var(--toska)" ukuran={240} speed={0.2} posisi="-right-16 top-1/3"  bentuk="kotak" />
      <Blob warna="var(--hijau)" ukuran={180} speed={0.5} posisi="bottom-4 right-[6%]"  bentuk="berlian" />
    </>}>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">Produk bagus layak punya <span className="tanda">kemasan yang bercerita.</span></h1>
          <p className="mt-5 max-w-lg text-lg">{identitas.visi}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <AjakDaftar />
            <a href="#layanan" className="nb btn" style={{ '--c': '#fff' }}>Lihat layanan</a>
          </div>
        </div>
        <div className="parallax relative" style={{ '--speed': -0.15 }}>
          <div className="nb float-y p-6" style={{ '--c': 'var(--matahari)', '--r': '3rem' }}>
            <img src="/images/ilustrasi-kemasan.svg" alt="Ilustrasi kotak kemasan" className="mx-auto w-full max-w-sm" />
          </div>
          <div className="nb absolute -bottom-5 -left-2 -rotate-3 px-4 py-2 font-extrabold" style={{ '--c': '#fff', '--r': '8px' }}>{identitas.nama}</div>
        </div>
      </div>
    </Screen>
  )
}

export function Layanan() {
  const [i, setI] = useState(0)
  const a = layanan[i]
  const IkonAktif = ikon[a.ikon]
  return (
    <Screen id="layanan" layers={<Blob warna="var(--hijau)" ukuran={300} speed={0.3} posisi="-right-20 top-16"  bentuk="lingkaran" />}>
      <h2 className="text-4xl font-bold">Apa yang bisa kami bantu?</h2>
      <p className="mt-3 max-w-xl">Pilih satu layanan untuk melihat isinya.</p>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {layanan.map((l, n) => {
            const I = ikon[l.ikon]
            return (
              <button key={l.judul} onClick={() => setI(n)} aria-pressed={i === n}
                className={`nb nb-hover p-5 text-left ${i === n ? 'nb-aktif' : ''}`} style={{ '--c': l.warna }}>
                <I className="size-8" />
                <span className="judul mt-3 block text-xl font-semibold [overflow-wrap:anywhere]">{l.judul}</span>
              </button>
            )
          })}
        </div>
        <div key={i} className="nb pop p-8" style={{ '--c': '#fff', '--r': '2.5rem' }}>
          <IkonAktif className="size-10" style={{ color: a.warna }} />
          <h3 className="mt-3 text-3xl font-semibold">{a.judul}</h3>
          <ul className="mt-5 grid gap-3">
            {a.poin.map((p) => <li key={p} className="nb px-5 py-3 font-semibold" style={{ '--c': a.warna, '--r': '1.25rem' }}>{p}</li>)}
          </ul>
        </div>
      </div>
    </Screen>
  )
}

export function Alur() {
  const [i, setI] = useState(0)
  const t = alur[i]
  return (
    <Screen id="alur" layers={<Blob warna="var(--jingga)" ukuran={320} speed={0.25} posisi="-left-24 bottom-10"  bentuk="kotak" />}>
      <h2 className="text-4xl font-bold">Bagaimana prosesnya?</h2>
      <p className="mt-3 max-w-xl">Klik tiap tahap untuk melihat langkahnya.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {alur.map((a, n) => {
          const I = ikon[a.ikon]
          return (
            <button key={a.judul} onClick={() => setI(n)} aria-pressed={i === n} className="nb btn nb-hover" style={{ '--c': i === n ? a.warna : '#fff' }}>
              <I className="size-5" />Tahap {n + 1}: {a.judul}
            </button>
          )
        })}
      </div>
      <ol key={i} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {t.langkah.map((l, n) => (
          <li key={l} className="nb pop flex items-center gap-4 p-5" style={{ '--c': '#fff', '--r': '1.75rem', animationDelay: `${n * 60}ms` }}>
            <span className="nb judul grid size-10 shrink-0 place-items-center text-lg font-semibold" style={{ '--c': t.warna, '--r': '999px' }}>{n + 1}</span>
            <span className="font-semibold">{l}</span>
          </li>
        ))}
      </ol>
    </Screen>
  )
}

export function Produksi() {
  return (
    <Screen id="produksi" layers={<Blob warna="var(--biru)" ukuran={280} speed={0.3} posisi="-right-16 top-20"  bentuk="berlian" />}>
      <h2 className="text-4xl font-bold">Dari gambar jadi kemasan nyata</h2>
      <p className="mt-3 max-w-xl">Kemasan diproduksi sesuai kebutuhan UMKM, setelah desain disetujui.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {produksi.map((p) => (
          <article key={p.judul} className="nb overflow-hidden p-4" style={{ '--c': '#fff', '--r': '2rem' }}>
            <img src="/images/foto-placeholder.svg" alt={`Foto draft ${p.judul}`} className="w-full rounded-lg border-[3px] border-[#111]" />
            <h3 className="mt-4 text-xl font-semibold">{p.judul}</h3>
            <p className="mt-1">{p.isi}</p>
          </article>
        ))}
      </div>
    </Screen>
  )
}

export function Konsultasi() {
  const { data, status } = useProfil()
  const lengkap = status === 'siap' && profilLengkap(data)
  return (
    <Screen id="konsultasi" layers={<>
      <Blob warna="var(--toska)" ukuran={260} speed={0.3} posisi="-left-16 top-10"  bentuk="lingkaran" />
      <Blob warna="var(--matahari)" ukuran={220} speed={0.45} posisi="-right-10 bottom-24"  bentuk="kotak" />
    </>}>
      <div className="nb mx-auto max-w-3xl p-8 text-center sm:p-12" style={{ '--c': 'var(--matahari)', '--r': '3rem' }}>
        <h2 className="text-4xl font-bold">{lengkap ? 'Siap berkonsultasi?' : 'Giliran Anda bercerita'}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg">{lengkap ? 'Data usaha Anda sudah tersimpan. Tekan tombol hijau WhatsApp di pojok kanan bawah, dan tim kami membantu dari desain sampai produksi.' : 'Daftarkan usaha Anda, lalu ceritakan produk dan kebutuhan kemasannya. Tim kami membantu dari desain sampai produksi.'}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <AjakDaftar denganMasuk />
        </div>
      </div>
      <p className="mt-10 text-center text-sm">Rumah Kemasan SINTESA Lebak, Pusat Layanan Kemasan Kabupaten Lebak</p>
    </Screen>
  )
}

export function Tentang() {
  return (
    <Screen id="tentang" layers={<Blob warna="var(--biru)" ukuran={300} speed={0.3} posisi="-left-24 top-24"  bentuk="berlian" />}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="text-4xl font-bold">{tentang.judul}</h2>
          <p className="mt-4 max-w-xl text-lg">{tentang.isi}</p>
          <h3 className="mt-8 text-2xl font-semibold">Fungsinya bagi UMKM</h3>
          <ul className="mt-4 grid gap-4">
            {fungsi.map((f) => {
              const I = ikon[f.ikon]
              return (
                <li key={f.judul} className="nb flex items-start gap-4 p-5" style={{ '--c': '#fff', '--r': '1.75rem' }}>
                  <span className="nb grid size-12 shrink-0 place-items-center" style={{ '--c': f.warna, '--r': '999px' }}><I className="size-6" /></span>
                  <div><p className="judul text-lg font-semibold">{f.judul}</p><p>{f.isi}</p></div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="grid content-center gap-5">
          {tentang.fakta.map((f) => {
            const I = ikon[f.ikon]
            return (
              <article key={f.judul} className="nb p-6" style={{ '--c': f.warna, '--r': '2.25rem' }}>
                <I className="size-8" />
                <h3 className="mt-2 text-xl font-semibold">{f.judul}</h3>
                <p className="mt-1 font-semibold">{f.isi}</p>
              </article>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}

export function VisiMisi() {
  return (
    <Screen id="visi-misi" layers={<>
      <Blob warna="var(--matahari)" ukuran={280} speed={0.35} posisi="-right-16 top-10"  bentuk="lingkaran" />
      <Blob warna="var(--toska)" ukuran={200} speed={0.2} posisi="-left-10 bottom-16"  bentuk="kotak" />
    </>}>
      <div className="nb p-8 sm:p-10" style={{ '--c': 'var(--matahari)', '--r': '3rem' }}>
        <h2 className="text-4xl font-bold">Visi</h2>
        <p className="judul mt-3 max-w-3xl text-2xl font-medium sm:text-3xl">{visiMisi.visi}</p>
      </div>
      <h2 className="mt-12 text-4xl font-bold">Misi</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {visiMisi.misi.map((m) => {
          const I = ikon[m.ikon]
          return (
            <div key={m.teks} className="nb flex items-start gap-4 p-6" style={{ '--c': '#fff', '--r': '2rem' }}>
              <span className="nb grid size-12 shrink-0 place-items-center" style={{ '--c': m.warna, '--r': '999px' }}><I className="size-6" /></span>
              <p className="font-semibold">{m.teks}</p>
            </div>
          )
        })}
      </div>
    </Screen>
  )
}
