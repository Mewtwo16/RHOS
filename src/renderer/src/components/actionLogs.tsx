import '../assets/css/logs.css'
import { useState } from 'react'



export function ActionLogs() {
  return (
    <>
      <main>
        <section className="logs-container">
          <h2>Logs de Ações</h2>
          <div className="controles-logs">
            <button id="buscar-logs">Pesquisar</button>
          </div>
          <div id="lista-logs" className="lista-logs" />
          <pre
            id="logs-raw"
            style={{
              display: 'none',
              whiteSpace: 'pre-wrap',
              background: '#f6f6f6',
              padding: 8,
              borderRadius: 4,
              marginTop: 8
            }}
          />
        </section>
      </main>
    </>
  )
}
