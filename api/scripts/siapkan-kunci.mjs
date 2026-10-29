// Membuat api/.dev.vars dari file kunci service account (hanya untuk uji lokal).
// Pemakaian: node scripts/siapkan-kunci.mjs <file-kunci.json> <ID-spreadsheet>
import { readFileSync, writeFileSync } from 'node:fs'

const [, , jalur, sheetId] = process.argv
if (!jalur || !sheetId) {
  console.error('Pemakaian: node scripts/siapkan-kunci.mjs <file-kunci.json> <ID-spreadsheet>')
  process.exit(1)
}
const k = JSON.parse(readFileSync(jalur, 'utf8'))
writeFileSync('.dev.vars', `GOOGLE_CLIENT_EMAIL=${k.client_email}\nGOOGLE_PRIVATE_KEY=${JSON.stringify(k.private_key)}\nSHEET_ID=${sheetId}\n`)
console.log('.dev.vars dibuat. File ini rahasia dan sudah diabaikan Git.')
