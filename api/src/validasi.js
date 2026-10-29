// Pemeriksaan di server: data dari browser tidak boleh dipercaya begitu saja.
const JENIS = ['Makanan', 'Minuman', 'Kosmetik atau herbal', 'Kerajinan', 'Lainnya']
const LAYANAN = ['Desain baru', 'Cetak ulang', 'Konsultasi bahan', 'Pengemasan ulang']
export const SOSMED = ['instagram', 'facebook', 'tiktok', 'shopee', 'tokopedia', 'website']

const teks = (v, maks = 300) => (typeof v === 'string' ? v.trim().slice(0, maks) : '')
const centang = (o, k) => o?.[k] === true

export function normalisasiWa(v = '') {
  let d = v.replace(/\D/g, '')
  if (d.startsWith('0')) d = '62' + d.slice(1)
  else if (d.startsWith('8')) d = '62' + d
  return d
}

export function bersihkan(d) {
  if (!d || typeof d !== 'object') return { galat: 'Data kosong.' }
  const data = {
    namaUsaha: teks(d.namaUsaha, 120),
    namaPemilik: teks(d.namaPemilik, 120),
    whatsapp: normalisasiWa(teks(d.whatsapp, 30)),
    kecamatan: teks(d.kecamatan, 60),
    legalitas: { nib: centang(d.legalitas, 'nib') },
    nomor: { nib: teks(d.nomor?.nib, 100) },
    layanan: (Array.isArray(d.layanan) ? d.layanan : []).filter((x) => LAYANAN.includes(x)),
    sosmed: Object.fromEntries(SOSMED.map((k) => [k, teks(d.sosmed?.[k], 300)]).filter(([, v]) => v)),
    catatan: teks(d.catatan, 1000),
    produk: (Array.isArray(d.produk) ? d.produk : []).slice(0, 5).map((p) => ({
      nama: teks(p?.nama, 120),
      jenis: teks(p?.jenis, 50),
      legalitas: { pirt: centang(p?.legalitas, 'pirt'), bpom: centang(p?.legalitas, 'bpom'), halal: centang(p?.legalitas, 'halal') },
      nomor: { pirt: teks(p?.nomor?.pirt, 100), bpom: teks(p?.nomor?.bpom, 100), halal: teks(p?.nomor?.halal, 100) },
    })),
  }
  if (!data.namaUsaha || !data.namaPemilik || !data.kecamatan) return { galat: 'Nama usaha, nama pemilik, dan kecamatan wajib diisi.' }
  if (!/^62\d{8,13}$/.test(data.whatsapp)) return { galat: 'Nomor WhatsApp tidak valid.' }
  if (data.layanan.length === 0) return { galat: 'Pilih minimal satu kebutuhan layanan.' }
  if (d.setuju !== true) return { galat: 'Persetujuan wajib dicentang.' }
  if (data.produk.length === 0 || data.produk.some((p) => !p.nama || !JENIS.includes(p.jenis))) return { galat: 'Lengkapi nama dan jenis setiap produk.' }
  return { data }
}
