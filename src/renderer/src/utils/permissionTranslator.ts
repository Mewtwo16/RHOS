// Mapeamento de permissões técnicas para textos amigáveis ao usuário

export const permissionTranslations: Record<string, string> = {
  // Usuários
  'users:create': 'Usuários: Criar',
  'users:read': 'Usuários: Consultar',
  'users:update': 'Usuários: Alterar',
  'users:delete': 'Usuários: Deletar',
  'users:view': 'Usuários: Visualizar',

  // Cargos
  'roles:create': 'Cargos: Criar',
  'roles:read': 'Cargos: Consultar',
  'roles:update': 'Cargos: Alterar',
  'roles:delete': 'Cargos: Deletar',
  'roles:view': 'Cargos: Visualizar',

  // Logs
  'logs:read': 'Logs: Consultar',
  'logs:view': 'Logs: Visualizar',
}

/**
 * Traduz uma permissão técnica para um texto amigável
 * @param permission - Permissão técnica (ex: 'users:create')
 * @returns Texto amigável (ex: 'Usuários: Criar')
 */
export function translatePermission(permission: string): string {
  return permissionTranslations[permission] || permission
}

/**
 * Traduz um array de permissões técnicas para textos amigáveis
 * @param permissions - Array de permissões técnicas
 * @returns Array de textos amigáveis
 */
export function translatePermissions(permissions: string[]): string[] {
  return permissions.map(translatePermission)
}

/**
 * Agrupa permissões por categoria (Usuários, Cargos, Logs, etc)
 * @param permissions - Array de permissões técnicas
 * @returns Objeto agrupado por categoria
 */
export function groupPermissionsByCategory(permissions: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {}

  permissions.forEach(permission => {
    const [category] = permission.split(':')
    const categoryName = getCategoryName(category)
    
    if (!grouped[categoryName]) {
      grouped[categoryName] = []
    }
    
    grouped[categoryName].push(permission)
  })

  return grouped
}

/**
 * Obtém o nome amigável da categoria
 */
function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    'users': 'Usuários',
    'roles': 'Cargos',
    'logs': 'Logs',
  }

  return categoryNames[category] || category
}

/**
 * Obtém a ação amigável (criar, alterar, deletar, etc)
 */
export function getActionName(action: string): string {
  const actionNames: Record<string, string> = {
    'create': 'Criar',
    'read': 'Consultar',
    'update': 'Alterar',
    'delete': 'Deletar',
    'view': 'Visualizar',
  }

  return actionNames[action] || action
}
