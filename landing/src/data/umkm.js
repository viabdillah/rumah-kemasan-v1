// 28 kecamatan Kabupaten Lebak (sumber: Wikipedia, data BPS; cocok dengan UU 115/2024).
export const kecamatanLebak = [
  'Banjarsari', 'Bayah', 'Bojongmanik', 'Cibadak', 'Cibeber', 'Cigemblong', 'Cihara', 'Cijaku', 'Cikulur', 'Cileles',
  'Cilograng', 'Cimarga', 'Cipanas', 'Cirinten', 'Curugbitung', 'Gunung Kencana', 'Kalanganyar', 'Lebakgedong',
  'Leuwidamar', 'Maja', 'Malingping', 'Muncang', 'Panggarangan', 'Rangkasbitung', 'Sajira', 'Sobang', 'Wanasalam', 'Warunggunung',
]
export const luarLebak = 'Di luar Kabupaten Lebak'

export const jenisProduk = ['Makanan', 'Minuman', 'Kosmetik atau herbal', 'Kerajinan', 'Lainnya']

export const layananList = ['Desain baru', 'Cetak ulang', 'Konsultasi bahan', 'Pengemasan ulang']

// NIB berlaku untuk seluruh usaha; PIRT, BPOM, dan Halal melekat pada tiap produk.
export const legalitasUsaha = [{ kode: 'nib', nama: 'NIB' }]
export const legalitasProduk = [
  { kode: 'pirt', nama: 'PIRT' },
  { kode: 'bpom', nama: 'BPOM' },
  { kode: 'halal', nama: 'Sertifikat Halal' },
]

export const maksProduk = 5

// Tiap platform ditambah lewat tombolnya sendiri dan disimpan di kolom terpisah.
export const platformSosmed = [
  { kode: 'instagram', nama: 'Instagram', contoh: '@namausaha atau tautan' },
  { kode: 'facebook', nama: 'Facebook', contoh: 'nama halaman atau tautan' },
  { kode: 'tiktok', nama: 'TikTok', contoh: '@namausaha atau tautan' },
  { kode: 'shopee', nama: 'Shopee', contoh: 'tautan toko' },
  { kode: 'tokopedia', nama: 'Tokopedia', contoh: 'tautan toko' },
  { kode: 'website', nama: 'Website', contoh: 'https://...' },
]
