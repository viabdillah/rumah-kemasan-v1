import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { verifikasiToken } from './firebase.js'
import { ambilUmkm, simpanUmkm } from './umkm.js'
import { bersihkan } from './validasi.js'

const app = new Hono()

// Hanya situs kita yang boleh memanggil API ini dari browser.
app.use('*', (c, next) =>
  cors({
    origin: (o) => (c.env.ALLOWED_ORIGINS.split(',').includes(o) ? o : null),
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: ['GET', 'PUT', 'OPTIONS'],
    maxAge: 600,
  })(c, next),
)

app.get('/', (c) => c.text('API Rumah Kemasan aktif'))

// Semua rute /umkm wajib membawa token login Firebase yang sah.
app.use('/umkm', async (c, next) => {
  if (c.req.method === 'OPTIONS') return next()
  const token = (c.req.header('Authorization') || '').replace(/^Bearer /, '')
  if (!token) return c.json({ galat: 'Perlu login.' }, 401)
  try {
    c.set('pengguna', await verifikasiToken(token, c.env.FIREBASE_PROJECT_ID))
  } catch {
    return c.json({ galat: 'Token tidak valid atau kedaluwarsa.' }, 401)
  }
  await next()
})

// Pengguna hanya bisa membaca dan mengubah data miliknya sendiri (uid dari token, bukan dari permintaan).
app.get('/umkm', async (c) => {
  const { uid } = c.get('pengguna')
  const hasil = await ambilUmkm(c.env, uid)
  return c.json({ data: hasil?.data ?? null })
})

app.put('/umkm', async (c) => {
  const { uid, email } = c.get('pengguna')
  let body
  try { body = await c.req.json() } catch { return c.json({ galat: 'Data tidak terbaca.' }, 400) }
  const bersih = bersihkan(body)
  if (bersih.galat) return c.json({ galat: bersih.galat }, 400)
  return c.json({ data: await simpanUmkm(c.env, uid, email, bersih.data) })
})

app.onError((e, c) => {
  console.error(e)
  return c.json({ galat: 'Terjadi kesalahan di server.' }, 500)
})

export default app
