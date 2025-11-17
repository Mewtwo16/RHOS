import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Usuarios from './pages/Usuarios'
import Cargos from './pages/Cargos'
import Logs from './pages/Logs'
import './assets/css/global.css'

function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    setInitialRoute(token ? '/home' : '/login')
  }, [])

  if (initialRoute === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Carregando...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="cargos" element={<Cargos />} />
          <Route path="logs" element={<Logs />} />
        </Route>
        <Route index element={<Navigate to={initialRoute} replace />} />
        <Route path="*" element={<Navigate to={initialRoute} replace />} />
      </Routes>
    </Router>
  )
}

export default App
