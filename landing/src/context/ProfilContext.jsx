import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { muat } from '../lib/umkm'

// Satu tempat untuk data profil UMKM, dipakai halaman profil, tombol WhatsApp, dan landing page.
const ProfilContext = createContext(null)

export function ProfilProvider({ children }) {
  const { user, siap } = useAuth()
  const uid = user?.uid
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('diam') // diam | memuat | siap | galat
  const [galat, setGalat] = useState('')

  useEffect(() => {
    if (!siap) return
    if (!uid) { setData(null); setStatus('diam'); setGalat(''); return }
    let batal = false
    setStatus('memuat')
    muat()
      .then((d) => { if (!batal) { setData(d); setStatus('siap') } })
      .catch((e) => { if (!batal) { setGalat(e.message); setStatus('galat') } })
    return () => { batal = true }
  }, [siap, uid])

  return <ProfilContext.Provider value={{ data, status, galat, setData }}>{children}</ProfilContext.Provider>
}

export const useProfil = () => useContext(ProfilContext)
