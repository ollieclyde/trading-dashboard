import 'dotenv/config'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import runsRouter from './routes/runs.js'
import debatesRouter from './routes/debates.js'
import themesRouter from './routes/themes.js'
import positionsRouter from './routes/positions.js'
import reflectionsRouter from './routes/reflections.js'
import pipelineRouter from './routes/pipeline.js'
import systemRouter from './routes/system.js'

// BigInt JSON serialization (Trade.t212OrderId)
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

async function start() {
  const app = express()
  app.use(express.json())

  // API routes
  app.use('/api/runs', runsRouter)
  app.use('/api/debates', debatesRouter)
  app.use('/api/themes', themesRouter)
  app.use('/api/positions', positionsRouter)
  app.use('/api/reflections', reflectionsRouter)
  app.use('/api/pipeline', pipelineRouter)
  app.use('/api/system', systemRouter)

  // Vite dev server middleware
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })
  app.use(vite.middlewares)

  const port = 3456
  app.listen(port, () => {
    console.log(`Dashboard running at http://localhost:${port}`)
  })
}

start().catch(console.error)
