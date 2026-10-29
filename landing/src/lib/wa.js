import { normalisasiWa, validasi } from './umkm'
import { luarLebak } from '../data/umkm'

export function salamWaktu(jam = new Date().getHours()) {
  if (jam < 11) return 'pagi'
  if (jam < 15) return 'siang'
  if (jam < 18) return 'sore'
  return 'malam'
}

// Data dianggap lengkap jika lolos semua pemeriksaan formulir (nama, WhatsApp, produk, layanan, persetujuan).
export const profilLengkap = (d) => !!d && Object.keys(validasi(d)).length === 0

export function pesanKonsultasi(d) {
  const produk = d.produk.map((p) => `${p.nama} (${p.jenis})`).join(', ')
  const legal = new Set()
  if (d.legalitas.nib) legal.add('NIB')
  d.produk.forEach((p) => {
    if (p.legalitas.pirt) legal.add('PIRT')
    if (p.legalitas.bpom) legal.add('BPOM')
    if (p.legalitas.halal) legal.add('Halal')
  })
  const asal = d.kecamatan === luarLebak ? 'dari luar Kabupaten Lebak' : `dari Kecamatan ${d.kecamatan}`
  return [
    `Halo, selamat ${salamWaktu()}, Tim Rumah Kemasan SINTESA Lebak 🙏`,
    '',
    `Saya ${d.namaPemilik}, pemilik usaha "${d.namaUsaha}" ${asal}.`,
    `Produk: ${produk}`,
    `Kebutuhan layanan: ${d.layanan.join(', ')}`,
    `Legalitas yang dimiliki: ${legal.size ? [...legal].join(', ') : 'belum ada'}`,
    '',
    'Saya sudah mendaftar di website Rumah Kemasan dan ingin berkonsultasi mengenai kemasan produk saya. Mohon informasi jadwal dan langkah selanjutnya. Terima kasih 🙏',
  ].join('\n')
}

// Nomor kosong -> wa.me tanpa nomor: WhatsApp meminta pengguna memilih kontak.
export const tautanWa = (nomor, teks) => `https://wa.me/${normalisasiWa(nomor || '')}?text=${encodeURIComponent(teks)}`
