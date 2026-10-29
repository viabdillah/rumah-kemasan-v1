import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProfilProvider } from './context/ProfilContext'
import Landing from './pages/Landing'
import Masuk from './pages/Masuk'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfilProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/masuk" element={<Masuk />} />
            <Route path="/daftar" element={<Navigate to="/masuk?tab=daftar" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProfilProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
