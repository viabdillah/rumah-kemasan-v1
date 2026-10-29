import { MessageCircle } from 'lucide-react'
import { useProfil } from '../context/ProfilContext'
import { kontak } from '../data/content'
import { pesanKonsultasi, profilLengkap, tautanWa } from '../lib/wa'

// Tautan WhatsApp hanya ada jika data UMKM sudah lengkap dan tersimpan.
function useTautanWa() {
  const { data, status } = useProfil()
  if (status !== 'siap' || !profilLengkap(data)) return null
  return tautanWa(kontak.whatsapp, pesanKonsultasi(data))
}

const buka = { target: '_blank', rel: 'noopener noreferrer' }

export function TombolWaMengapung() {
  const href = useTautanWa()
  if (!href) return null
  return (
    <a href={href} {...buka} aria-label="Konsultasi lewat WhatsApp" className="clay btn clay-hover fixed right-4 z-40"
      style={{ '--c': 'var(--hijau)', bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
      <MessageCircle className="size-6" />
      <span className="hidden sm:inline">Konsultasi via WhatsApp</span>
    </a>
  )
}

export function TombolWa() {
  const href = useTautanWa()
  if (!href) return null
  return (
    <a href={href} {...buka} className="clay btn clay-hover" style={{ '--c': 'var(--hijau)' }}>
      <MessageCircle className="size-5" />Konsultasi via WhatsApp
    </a>
  )
}
