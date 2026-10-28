import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [siap, setSiap] = useState(false) // false selama Firebase masih memeriksa sesi

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setSiap(true) }), [])

  return (
    <AuthContext.Provider value={{ user, siap, keluar: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
