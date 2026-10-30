import { useEffect, useRef } from 'react'

// Batang di tepi atas yang terisi seiring pembaca menggulir cerita.
export default function ProgresGulir() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const ubah = () => {
      const h = document.documentElement
      el.style.setProperty('--p', h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    }
    ubah()
    window.addEventListener('scroll', ubah, { passive: true })
    window.addEventListener('resize', ubah)
    return () => { window.removeEventListener('scroll', ubah); window.removeEventListener('resize', ubah) }
  }, [])
  return <div ref={ref} className="progres" aria-hidden="true"><i /></div>
}
