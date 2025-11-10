import type { Knex } from 'knex'
import db from '../db/db'

export interface EntradaLog {
  user_id?: number | null
  username?: string | null
  action: string
  resource?: string | null
  resource_id?: number | null
  details?: string | null
}

class LogsService {
  // Registra uma linha de auditoria; aceita transação opcional para atomicidade com operação principal
  async writeLogs(entry: EntradaLog, trx?: Knex.Transaction) {
    try {
      const q = trx ? trx('audit_logs') : db('audit_logs')
      const detailsObj: any = {}
      if (entry.username) detailsObj.username = entry.username
      if (entry.details) detailsObj.details = entry.details

      await q.insert({
        users_id: entry.user_id || null,
        action: entry.action,
        resource: entry.resource || null,
        resource_id: entry.resource_id || null,
        details: Object.keys(detailsObj).length ? JSON.stringify(detailsObj) : null
      })
      return { success: true }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  // Lista logs em ordem decrescente; pode limitar quantidade
  async listLogs(limit?: number) {
    try {
      const base = db('audit_logs').select('*').orderBy('created_at', 'desc')
      const rows = typeof limit === 'number' ? await base.limit(limit) : await base

      const normalized = rows.map((r: any) => {
        let username: string | null = null
        let detailsStr: string | null = null
        if (r.details) {
          try {
            const d = typeof r.details === 'string' ? JSON.parse(r.details) : r.details
            username = d?.username ?? null
            detailsStr = d?.details ?? (typeof d === 'object' ? JSON.stringify(d) : String(d))
          } catch {
            detailsStr = String(r.details)
          }
        }
        return {
          id: r.id,
          user_id: r.users_id,
          action: r.action,
          resource: r.resource ?? null,
          resource_id: r.resource_id ?? null,
          created_at: r.created_at,
          username,
          details: detailsStr
        }
      })

      console.debug(
        '[ServicoLogs] listar: rows.length=',
        Array.isArray(rows) ? rows.length : 'not-array',
        rows && rows[0]
      )
      return { success: true, data: normalized }
    } catch (err) {
      console.error('Erro ao listar logs:', err)
      return { success: false, error: String(err) }
    }
  }
}

export default new LogsService()
