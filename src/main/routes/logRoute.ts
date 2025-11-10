import { Request, Response } from 'express'
import logService from '../services/logService'

/**
 * Lista logs de auditoria ordenados por data desc.
 * Query opcional: ?limit=NUMBER para limitar quantidade.
 */
export async function getLogsRoute(req: Request, res: Response) {
  try {
    const rawLimit = req.query.limit as string | undefined
    let limit: number | undefined = undefined
    if (rawLimit) {
      const parsed = parseInt(rawLimit, 10)
      if (!isNaN(parsed) && parsed > 0) {
        limit = parsed
      }
    }
    const resultado = await logService.listLogs(limit)
    if (resultado.success) {
      return res.json({ success: true, data: resultado.data })
    }
    return res
      .status(500)
      .json({ success: false, message: resultado.error || 'Falha ao listar logs.' })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || error })
  }
}
