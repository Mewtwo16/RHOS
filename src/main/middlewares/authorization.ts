import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import type { AuthUser } from '../types'

export function requirePermissions(...perms: string[]){
    return (req: Request, res: Response, next: NextFunction) => {
        const user: AuthUser = req.user

    }
 }