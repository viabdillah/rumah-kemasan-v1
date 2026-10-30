// Logo draf berbentuk perisai. Ubah singkatan dan warna lewat data mitra di data/content.js.
export function LogoDraf({ singkatan, warna, ukuran = 80 }) {
  const huruf = Math.min(30, 130 / (singkatan.length + 1))
  return (
    <svg viewBox="0 0 100 100" width={ukuran} height={ukuran} role="img" aria-label={`Logo draf ${singkatan}`}>
      <path d="M50 4 L92 20 V52 C92 74 74 90 50 97 C26 90 8 74 8 52 V20 Z" style={{ fill: warna }} stroke="#111" strokeWidth="5" strokeLinejoin="round" />
      <text x="50" y="58" textAnchor="middle" fontFamily="'Bricolage Grotesque', Arial, sans-serif" fontWeight="800" fontSize={huruf} fill="#111">{singkatan}</text>
    </svg>
  )
}
