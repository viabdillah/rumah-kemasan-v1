import { baca, tulisBanyak, tambah } from './sheets.js'
import { SOSMED } from './validasi.js'

// Urutan kolom lembar UMKM (A..T) dan Produk (A..J) harus sama dengan Spreadsheet.
const pad = (b, n) => Array.from({ length: n }, (_, i) => b[i] ?? '')
const ya = (v) => v === 'ya'
const yaTidak = (v) => (v ? 'ya' : 'tidak')

function dariBaris(b, produk) {
  return {
    namaUsaha: b[2], namaPemilik: b[3], whatsapp: b[4], kecamatan: b[5],
    legalitas: { nib: ya(b[6]) }, nomor: { nib: b[7] },
    layanan: b[8] ? b[8].split(', ') : [],
    sosmed: Object.fromEntries(SOSMED.map((k, i) => [k, b[9 + i]]).filter(([, v]) => v)),
    catatan: b[15], setuju: ya(b[16]), status: b[17] || 'Menunggu verifikasi', dibuat: b[18], diperbarui: b[19],
    produk: produk.map((p) => ({
      nama: p[2], jenis: p[3],
      legalitas: { pirt: ya(p[4]), bpom: ya(p[6]), halal: ya(p[8]) },
      nomor: { pirt: p[5], bpom: p[7], halal: p[9] },
    })),
  }
}

function keBarisUmkm(uid, email, d, status, dibuat, diperbarui) {
  return [
    uid, email, d.namaUsaha, d.namaPemilik, d.whatsapp, d.kecamatan, yaTidak(d.legalitas.nib), d.nomor.nib,
    d.layanan.join(', '), ...SOSMED.map((k) => d.sosmed[k] ?? ''), d.catatan, 'ya', status, dibuat, diperbarui,
  ]
}

const keBarisProduk = (uid, p, i) => [uid, i + 1, p.nama, p.jenis, yaTidak(p.legalitas.pirt), p.nomor.pirt, yaTidak(p.legalitas.bpom), p.nomor.bpom, yaTidak(p.legalitas.halal), p.nomor.halal]

export async function ambilUmkm(env, uid) {
  const semua = await baca(env, 'UMKM!A2:T')
  const i = semua.findIndex((b) => b[0] === uid)
  if (i < 0) return null
  const produk = (await baca(env, 'Produk!A2:J'))
    .filter((p) => p[0] === uid).map((p) => pad(p, 10))
    .sort((a, b) => Number(a[1]) - Number(b[1]))
  return { baris: i + 2, data: dariBaris(pad(semua[i], 20), produk) }
}

export async function simpanUmkm(env, uid, email, d) {
  const ada = await ambilUmkm(env, uid)
  const sekarang = new Date().toISOString()
  const status = ada?.data.status ?? 'Menunggu verifikasi' // status hanya diubah staf
  const dibuat = ada?.data.dibuat || sekarang
  const barisUmkm = keBarisUmkm(uid, email, d, status, dibuat, sekarang)

  // Lembar Produk: timpa baris lama milik uid ini, kosongkan yang berlebih, tambahkan yang baru.
  const lama = (await baca(env, 'Produk!A2:J')).map((p, i) => [p[0], i + 2]).filter(([u]) => u === uid).map(([, r]) => r)
  const baru = d.produk.map((p, i) => keBarisProduk(uid, p, i))
  const data = lama.map((r, i) => ({ range: `Produk!A${r}:J${r}`, values: [baru[i] ?? Array(10).fill('')] }))
  if (ada) data.push({ range: `UMKM!A${ada.baris}:T${ada.baris}`, values: [barisUmkm] })
  if (data.length) await tulisBanyak(env, data)
  if (!ada) await tambah(env, 'UMKM!A:T', [barisUmkm])
  if (baru.length > lama.length) await tambah(env, 'Produk!A:J', baru.slice(lama.length))

  return { ...d, setuju: true, status, dibuat, diperbarui: sekarang }
}
