import express from 'express'
const route = express.Router()

import {loginSchema, loginIsValid} from './middlewares/loginValidate';
import  {addUserSchema, userIsValid} from './middlewares/addUserValidate';
import { addRoleSchema, roleIsValid } from './middlewares/addRoleValidate'


import { loginRoute } from './routes/authRoute'
import { addUserRoute, getUserRoute } from './routes/userRoute';
import { healthRoute } from './routes/healthRoute'
import { addRoleRoute, getRoleRoute} from './routes/roleRoute'
import { getAllowedRoute } from './routes/allowedRoute'
import { getLogsRoute } from './routes/logRoute'

// Rotas públicas
route.get('/api/health', healthRoute)

// Rota Login
route.post('/api/login', loginIsValid(loginSchema), loginRoute)

// Usuários
route.post('/api/user', userIsValid(addUserSchema), addUserRoute)
route.get('/api/user', getUserRoute)

// Cargos / Permissões
route.get('/api/role', getRoleRoute)
route.post('/api/role', roleIsValid(addRoleSchema), addRoleRoute)
route.get('/api/allowed', getAllowedRoute)

// Auditoria
route.get('/api/logs', getLogsRoute)



export default route
