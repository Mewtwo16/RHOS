import express from 'express'
const route = express.Router()

import { loginSchema, loginIsValid } from './middlewares/loginValidate'
import { addUserSchema, userIsValid } from './middlewares/addUserValidate'
import { addRoleSchema, roleIsValid } from './middlewares/addRoleValidate'

import { authenticateToken, requirePermissions } from './middlewares/authorization'

import { loginRoute } from './routes/authRoute'
import { addUserRoute, getUserRoute, listUsersRoute, updateUserRoute } from './routes/userRoute'
import { healthRoute } from './routes/healthRoute'
import { addRoleRoute, getRoleRoute, listRolesRoute, updateRoleRoute } from './routes/roleRoute'
import { getAllowedRoute } from './routes/allowedRoute'
import { getLogsRoute } from './routes/logRoute'
import cargoRoute from './routes/cargoRoute'
import funcionarioRoute from './routes/funcionarioRoute'

route.get('/api/health', healthRoute)

route.post('/api/login', loginIsValid(loginSchema), loginRoute)

route.post('/api/user', authenticateToken, requirePermissions('users:create'), userIsValid(addUserSchema), addUserRoute)

route.put('/api/user/:id', authenticateToken, requirePermissions('users:update'), updateUserRoute)

route.get('/api/user', authenticateToken, requirePermissions('users:view'), getUserRoute)

route.get('/api/users', authenticateToken, requirePermissions('users:view'), listUsersRoute)

route.post('/api/role', authenticateToken, requirePermissions('roles:create'), roleIsValid(addRoleSchema),addRoleRoute)

route.put('/api/role/:id', authenticateToken, requirePermissions('roles:update'), updateRoleRoute)

route.get('/api/role', authenticateToken, requirePermissions('roles:view'), getRoleRoute)

route.get('/api/roles', authenticateToken, requirePermissions('roles:view'), listRolesRoute)

route.get('/api/allowed', authenticateToken, requirePermissions('permissions:view'), getAllowedRoute)
route.get('/api/logs', authenticateToken, requirePermissions('logs:view'), getLogsRoute)

route.use('/api/cargos', authenticateToken, requirePermissions('cargos:view'), cargoRoute)

route.use('/api/funcionarios', authenticateToken, requirePermissions('funcionarios:view'), funcionarioRoute)

export default route
