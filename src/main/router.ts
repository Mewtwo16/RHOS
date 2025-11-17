import express from 'express'
const route = express.Router()

import { loginSchema, loginIsValid } from './middlewares/loginValidate'
import { addUserSchema, userIsValid } from './middlewares/addUserValidate'
import { addRoleSchema, roleIsValid } from './middlewares/addRoleValidate'
import { requirePermissions } from './middlewares/authorization'

import { loginRoute } from './routes/authRoute'
import { addUserRoute, getUserRoute, listUsersRoute, updateUserRoute } from './routes/userRoute'
import { healthRoute } from './routes/healthRoute'
import { addRoleRoute, getRoleRoute, listRolesRoute, updateRoleRoute } from './routes/roleRoute'
import { getAllowedRoute } from './routes/allowedRoute'
import { getLogsRoute } from './routes/logRoute'

route.get('/api/health', healthRoute)
route.post('/api/login', loginIsValid(loginSchema), loginRoute)

route.post('/api/user', requirePermissions('users:create'), userIsValid(addUserSchema), addUserRoute)
route.put('/api/user/:id', requirePermissions('users:update'), updateUserRoute)
route.get('/api/user', requirePermissions('users:read'), getUserRoute)
route.get('/api/users', requirePermissions('users:read'), listUsersRoute)

route.post('/api/role', requirePermissions('roles:create'), roleIsValid(addRoleSchema), addRoleRoute)
route.put('/api/role/:id', requirePermissions('roles:update'), updateRoleRoute)
route.get('/api/role', requirePermissions('roles:read'), getRoleRoute)
route.get('/api/roles', requirePermissions('roles:read'), listRolesRoute)
route.get('/api/allowed', requirePermissions('roles:read'), getAllowedRoute)

route.get('/api/logs', requirePermissions('logs:read'), getLogsRoute)

export default route
