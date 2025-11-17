interface DecodedToken {
  id: number
  user: string
  role: string[]
  perm: string[]
  iat: number
  exp: number
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return null
  }
}

export function getUserPermissions(): string[] {
  const token = localStorage.getItem('authToken')
  if (!token) return []
  
  const decoded = decodeToken(token)
  return decoded?.perm || []
}

export function hasPermission(permission: string): boolean {
  const permissions = getUserPermissions()
  return permissions.includes(permission)
}

/**
 * Verifica se o usuário tem todas as permissões especificadas
 */
export function hasAllPermissions(requiredPermissions: string[]): boolean {
  const permissions = getUserPermissions()
  return requiredPermissions.every(perm => permissions.includes(perm))
}

/**
 * Verifica se o usuário tem pelo menos uma das permissões especificadas
 */
export function hasAnyPermission(requiredPermissions: string[]): boolean {
  const permissions = getUserPermissions()
  return requiredPermissions.some(perm => permissions.includes(perm))
}

/**
 * Obtém os cargos do usuário atual
 */
export function getUserRoles(): string[] {
  const token = localStorage.getItem('authToken')
  if (!token) return []
  
  const decoded = decodeToken(token)
  return decoded?.role || []
}

/**
 * Obtém o nome de usuário do token
 */
export function getUsername(): string | null {
  const token = localStorage.getItem('authToken')
  if (!token) return null
  
  const decoded = decodeToken(token)
  return decoded?.user || null
}

/**
 * Verifica se o token está expirado
 */
export function isTokenExpired(): boolean {
  const token = localStorage.getItem('authToken')
  if (!token) return true
  
  const decoded = decodeToken(token)
  if (!decoded) return true
  
  // exp está em segundos, Date.now() em milissegundos
  return decoded.exp * 1000 < Date.now()
}

/**
 * Limpa o token e redireciona para login
 */
export function logout() {
  localStorage.removeItem('authToken')
  window.location.href = '/login'
}
