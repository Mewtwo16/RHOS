import express from 'express'
const route = express.Router()

// Middlewares de validação
import { loginSchema, loginIsValid } from './middlewares/loginValidate'
import { addUserSchema, userIsValid } from './middlewares/addUserValidate'
import { addRoleSchema, roleIsValid } from './middlewares/addRoleValidate'

// Middlewares de autenticação e autorização
import { authenticateToken, requirePermissions } from './middlewares/authorization'

// Routes
import { loginRoute } from './routes/authRoute'
import { addUserRoute, getUserRoute, listUsersRoute, updateUserRoute } from './routes/userRoute'
import { healthRoute } from './routes/healthRoute'
import { addRoleRoute, getRoleRoute, listRolesRoute, updateRoleRoute } from './routes/roleRoute'
import { getAllowedRoute } from './routes/allowedRoute'
import { getLogsRoute } from './routes/logRoute'

// ============================================
// ROTAS PÚBLICAS (sem autenticação)
// ============================================
route.get('/api/health', healthRoute)

// ============================================
// AUTENTICAÇÃO
// ============================================
route.post('/api/login', loginIsValid(loginSchema), loginRoute)

// ============================================
// USUÁRIOS (requer autenticação + permissões)
// ============================================
route.post(
  '/api/user',
  authenticateToken,
  requirePermissions('users:create'),
  userIsValid(addUserSchema),
  addUserRoute
)

route.put(
  '/api/user/:id',
  authenticateToken,
  requirePermissions('users:update'),
  updateUserRoute
)

route.get(
  '/api/user',
  authenticateToken,
  requirePermissions('users:view'),
  getUserRoute
)

route.get(
  '/api/users',
  authenticateToken,
  requirePermissions('users:view'),
  listUsersRoute
)

// ============================================
// CARGOS E PERMISSÕES (requer autenticação)
// ============================================
route.post(
  '/api/role',
  authenticateToken,
  requirePermissions('roles:create'),
  roleIsValid(addRoleSchema),
  addRoleRoute
)

route.put(
  '/api/role/:id',
  authenticateToken,
  requirePermissions('roles:update'),
  updateRoleRoute
)

route.get(
  '/api/role',
  authenticateToken,
  requirePermissions('roles:view'),
  getRoleRoute
)

route.get(
  '/api/roles',
  authenticateToken,
  requirePermissions('roles:view'),
  listRolesRoute
)

route.get(
  '/api/allowed',
  authenticateToken,
  requirePermissions('permissions:view'),
  getAllowedRoute
)

// ============================================
// AUDITORIA (requer autenticação + permissão)
// ============================================
route.get(
  '/api/logs',
  authenticateToken,
  requirePermissions('logs:view'),
  getLogsRoute
)

export default route
