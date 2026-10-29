import { importPKCS8, SignJWT } from 'jose'

const BASE = 'https://sheets.googleapis.com/v4/spreadsheets'
let cache = { token: '', habis: 0 }

async function tokenGoogle(env) {
  if (cache.token && Date.now() < cache.habis - 60_000) return cache.token
  const kunci = await importPKCS8(env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 'RS256')
  const jwt = await new SignJWT({ scope: 'https://www.googleapis.com/auth/spreadsheets' })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(env.GOOGLE_CLIENT_EMAIL)
    .setSubject(env.GOOGLE_CLIENT_EMAIL)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(kunci)
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  })
  if (!r.ok) throw new Error(`Gagal mengambil token Google (${r.status})`)
  const j = await r.json()
  cache = { token: j.access_token, habis: Date.now() + j.expires_in * 1000 }
  return cache.token
}

async function panggil(env, path, opsi = {}) {
  const r = await fetch(`${BASE}/${env.SHEET_ID}${path}`, {
    ...opsi,
    headers: { Authorization: `Bearer ${await tokenGoogle(env)}`, 'Content-Type': 'application/json' },
  })
  if (!r.ok) throw new Error(`Sheets ${r.status}: ${(await r.text()).slice(0, 200)}`)
  return r.json()
}

const enc = encodeURIComponent

export async function baca(env, rentang) {
  return (await panggil(env, `/values/${enc(rentang)}`)).values ?? []
}

// RAW = isi disimpan apa adanya, sehingga teks seperti "=1+1" tidak dijalankan sebagai rumus.
export function tulisBanyak(env, data) {
  return panggil(env, '/values:batchUpdate', { method: 'POST', body: JSON.stringify({ valueInputOption: 'RAW', data }) })
}

export function tambah(env, rentang, baris) {
  return panggil(env, `/values/${enc(rentang)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: 'POST', body: JSON.stringify({ values: baris }),
  })
}
