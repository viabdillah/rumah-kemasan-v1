import Navbar from '../components/Navbar'
import { Hero, Tentang, VisiMisi, Layanan, Alur, Produksi, Konsultasi } from '../components/Sections'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Tentang />
        <VisiMisi />
        <Layanan />
        <Alur />
        <Produksi />
        <Konsultasi />
      </main>
    </>
  )
}
