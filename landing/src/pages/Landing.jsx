import Navbar from '../components/Navbar'
import ProgresGulir from '../components/ProgresGulir'
import Footer from '../components/Footer'
import { TombolWaMengapung } from '../components/TombolWa'
import { Hero, Tentang, VisiMisi, Layanan, Alur, Produksi, Konsultasi } from '../components/Sections'

export default function Landing() {
  return (
    <>
      <ProgresGulir />
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
      <Footer />
      <TombolWaMengapung />
    </>
  )
}
