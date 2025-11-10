/*
    Tipos compartilhados entre main/preload/renderer
*/

export interface AnyResponse {
  success: boolean
  message?: string
  data?: any[]
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
}

export interface AuthUser {
  id: number
  usuario: string
  cargo: string[]
  permissoes: string[]
}

export interface User {
  id: number
  full_name: string
  email: string
  login: string
  cpf: string
  birth_date: string
  status: boolean
  role: string
}

export interface addUser {
  full_name: string
  email: string
  cpf: string
  birth_date: string
  user: string
  password: string
  status: boolean
  role: string
}

export interface Role {
  id: number
  role_name: string
  description?: string
  allowed_id?: number
}

export interface addRole {
  role_name: string
  description?: string
  permissions?: string[]
}

export interface AllowedPermission {
  id: number
  permission_name: string
}

export interface AllowedResponse {
  success: boolean
  data?: AllowedPermission[]
  message?: string
}

export interface IElectronAPI {
  submitLogin: (usuario: string, senha: string) => Promise<LoginResponse>
  addUser: (dadosUsuario: addUser) => Promise<AnyResponse>
  addRole: (dadosCargo: addRole) => Promise<AnyResponse>
  getAllRoles: () => Promise<Role[] | AnyResponse>
  searchUsers: (filters?: { field?: string; value?: string }) => Promise<User[] | AnyResponse>
  searchRoles: (filters?: { field?: string; value?: string }) => Promise<Role[] | AnyResponse>
  logAction: (entry: any) => Promise<AnyResponse>
  getLogs: (limit?: number) => Promise<AnyResponse>
  getAllowed: () => Promise<AllowedResponse>
}
