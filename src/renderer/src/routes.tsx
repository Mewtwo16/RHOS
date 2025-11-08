import { HashRouter, Routes, Route } from 'react-router-dom'

import { Login } from './components/login'
import { ActionLogs } from './components/actionLogs'
import { Menu } from './components/menu'
import { Users } from './components/User'
import { Role } from './components/Role'

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/logs" element={<ActionLogs />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/users" element={<Users />} />
        <Route path="/role" element={<Role />} />
      </Routes>
    </HashRouter>
  )
}
