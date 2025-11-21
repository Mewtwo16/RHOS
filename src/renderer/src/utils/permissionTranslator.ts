// Mapeamento de permissões técnicas para textos amigáveis ao usuário

export const permissionTranslations: Record<string, string> = {
  // Usuários
  'users:create': 'Usuários: Criar',
  'users:read': 'Usuários: Consultar',
  'users:update': 'Usuários: Alterar',
  'users:delete': 'Usuários: Deletar',
  'users:view': 'Usuários: Visualizar',

  // Perfis de Acesso
  'profiles:create': 'Perfis: Criar',
  'profiles:read': 'Perfis: Consultar',
  'profiles:update': 'Perfis: Alterar',
  'profiles:delete': 'Perfis: Deletar',
  'profiles:view': 'Perfis: Visualizar',

  // Logs
  'logs:read': 'Logs: Consultar',
  'logs:view': 'Logs: Visualizar',

  // Permissões
  'permissions:view': 'Permissões: Visualizar',
  'permissions:create': 'Permissões: Criar',
  'permissions:update': 'Permissões: Alterar',
  'permissions:delete': 'Permissões: Deletar',

  // Funcionários
  'employees:create': 'Funcionários: Criar',
  'employees:read': 'Funcionários: Consultar',
  'employees:update': 'Funcionários: Alterar',
  'employees:delete': 'Funcionários: Deletar',
  'employees:view': 'Funcionários: Visualizar',
  'employees:calculate': 'Funcionários: Calcular Folha',

  // Cargos
  'positions:create': 'Cargos: Criar',
  'positions:read': 'Cargos: Consultar',
  'positions:update': 'Cargos: Alterar',
  'positions:delete': 'Cargos: Deletar',
  'positions:view': 'Cargos: Visualizar',
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
 * Agrupa permissões por categoria (Usuários, Perfis, Logs, etc)
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
    'profiles': 'Perfis de Acesso',
    'logs': 'Logs',
    'permissions': 'Permissões',
    'employees': 'Funcionários',
    'positions': 'Cargos',
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
    'calculate': 'Calcular',
  }

  return actionNames[action] || action
}
