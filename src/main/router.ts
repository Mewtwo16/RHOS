import express from 'express'
const route = express.Router()

import { loginSchema, loginIsValid } from './middlewares/loginValidate'
import { addUserSchema, userIsValid } from './middlewares/addUserValidate'
import { addProfileSchema, profileIsValid } from './middlewares/addProfileValidate'

import { authenticateToken, requirePermissions } from './middlewares/authorization'

import { loginRoute } from './routes/authRoute'
import { addUserRoute, getUserRoute, listUsersRoute, updateUserRoute } from './routes/userRoute'
import { healthRoute } from './routes/healthRoute'
import { addProfileRoute, getProfileRoute, listProfilesRoute, updateProfileRoute } from './routes/profileRoute'
import { getAllowedRoute } from './routes/allowedRoute'
import { getLogsRoute } from './routes/logRoute'
import positionRoute from './routes/positionRoute'
import employeeRoute from './routes/employeeRoute'

route.get('/api/health', healthRoute)

route.post('/api/login', loginIsValid(loginSchema), loginRoute)

route.post('/api/user', authenticateToken, requirePermissions('users:create'), userIsValid(addUserSchema), addUserRoute)

route.put('/api/user/:id', authenticateToken, requirePermissions('users:update'), updateUserRoute)

route.get('/api/user', authenticateToken, requirePermissions('users:view'), getUserRoute)

route.get('/api/users', authenticateToken, requirePermissions('users:view'), listUsersRoute)

route.post('/api/profile', authenticateToken, requirePermissions('profiles:create'), profileIsValid(addProfileSchema), addProfileRoute)

route.put('/api/profile/:id', authenticateToken, requirePermissions('profiles:update'), updateProfileRoute)

route.get('/api/profile', authenticateToken, requirePermissions('profiles:view'), getProfileRoute)

route.get('/api/profiles', authenticateToken, requirePermissions('profiles:view'), listProfilesRoute)

route.get('/api/allowed', authenticateToken, requirePermissions('permissions:view'), getAllowedRoute)
route.get('/api/logs', authenticateToken, requirePermissions('logs:view'), getLogsRoute)

route.use('/api/positions', authenticateToken, requirePermissions('positions:view'), positionRoute)

route.use('/api/employees', authenticateToken, requirePermissions('employees:view'), employeeRoute)

export default route
