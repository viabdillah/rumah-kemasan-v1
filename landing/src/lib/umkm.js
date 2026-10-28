// Data UMKM. SEMENTARA disimpan di localStorage browser ini saja (untuk uji tampilan).
// Nanti ganti isi muat() dan simpan() menjadi panggilan ke webhook n8n -> Google Spreadsheet.
// Tampilan (Dashboard.jsx) tidak perlu diubah karena kedua fungsi sudah async.

export const produkKosong = () => ({
  nama: '', jenis: '',
  legalitas: { pirt: false, bpom: false, halal: false },
  nomor: { pirt: '', bpom: '', halal: '' },
})

export const kosong = (namaPemilik = '') => ({
  namaUsaha: '', namaPemilik, whatsapp: '', kecamatan: '',
  produk: [produkKosong()],
  legalitas: { nib: false }, // legalitas usaha; PIRT, BPOM, Halal ada di tiap produk
  nomor: { nib: '' },
  layanan: [],
  sosmed: {}, // hanya platform yang ditambahkan, misalnya { instagram: '@toko', facebook: '...' }
  catatan: '', setuju: false,
  status: 'Menunggu verifikasi', // diatur staf, bukan UMKM
})

// Mengubah data lama ke bentuk terbaru (produk banyak, legalitas per produk, media sosial per platform).
const ambilLegal = (l = {}) => ({ pirt: !!l.pirt, bpom: !!l.bpom, halal: !!l.halal })
const ambilNomor = (n = {}) => ({ pirt: n.pirt || '', bpom: n.bpom || '', halal: n.halal || '' })

export function normalisasi(d) {
  if (!d) return null
  const daftar = Array.isArray(d.produk) && d.produk.length ? d.produk : [{ nama: d.namaProduk || '', jenis: d.jenisProduk || '' }]
  const produk = daftar.map((p, i) => {
    const k = produkKosong()
    const lama = i === 0 && !p.legalitas // data lama: legalitas satu untuk semua -> dipindah ke produk pertama
    return {
      ...k, ...p,
      legalitas: { ...k.legalitas, ...(p.legalitas ?? (lama ? ambilLegal(d.legalitas) : {})) },
      nomor: { ...k.nomor, ...(p.nomor ?? (lama ? ambilNomor(d.nomor) : {})) },
    }
  })
  const hasil = {
    ...kosong(), ...d, produk,
    legalitas: { nib: !!d.legalitas?.nib },
    nomor: { nib: d.nomor?.nib || '' },
    sosmed: d.sosmed ?? (d.instagram ? { instagram: d.instagram } : {}),
  }
  delete hasil.namaProduk; delete hasil.jenisProduk; delete hasil.instagram
  return hasil
}

// 0812... / +62812... / 812... -> 62812...
export function normalisasiWa(v = '') {
  let d = v.replace(/\D/g, '')
  if (d.startsWith('0')) d = '62' + d.slice(1)
  else if (d.startsWith('8')) d = '62' + d
  return d
}

export function validasi(d) {
  const e = {}
  if (!d.namaUsaha.trim()) e.namaUsaha = 'Nama usaha wajib diisi.'
  if (!d.namaPemilik.trim()) e.namaPemilik = 'Nama pemilik wajib diisi.'
  if (!/^62\d{8,13}$/.test(normalisasiWa(d.whatsapp))) e.whatsapp = 'Nomor WhatsApp tidak valid. Contoh: 081234567890.'
  if (!d.kecamatan) e.kecamatan = 'Pilih kecamatan.'
  d.produk.forEach((p, i) => {
    if (!p.nama.trim()) e[`produk${i}nama`] = 'Nama produk wajib diisi.'
    if (!p.jenis) e[`produk${i}jenis`] = 'Pilih jenis.'
  })
  if (d.layanan.length === 0) e.layanan = 'Pilih minimal satu kebutuhan layanan.'
  if (!d.setuju) e.setuju = 'Centang persetujuan untuk melanjutkan.'
  return e
}

const kunci = (uid) => `umkm:${uid}`

export async function muat(uid) {
  try { return normalisasi(JSON.parse(localStorage.getItem(kunci(uid)))) } catch { return null }
}

export async function simpan(uid, d) {
  const data = {
    ...d,
    whatsapp: normalisasiWa(d.whatsapp),
    sosmed: Object.fromEntries(Object.entries(d.sosmed).filter(([, v]) => v.trim())), // buang platform yang dikosongkan
    diperbarui: new Date().toISOString(),
  }
  localStorage.setItem(kunci(uid), JSON.stringify(data))
  return data
}
