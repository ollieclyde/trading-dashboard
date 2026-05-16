import { Router } from 'express'
import { readFile } from 'fs/promises'
import { resolve } from 'path'

const TRADING_AGENT_DIR = resolve(import.meta.dirname, '../../../trading-agent')

const router = Router()

router.get('/config', async (_req, res) => {
  try {
    const raw = await readFile(resolve(TRADING_AGENT_DIR, 'config.json'), 'utf8')
    res.json(JSON.parse(raw))
  } catch (err) {
    console.error('[/api/system/config]', err)
    res.status(500).json({ error: 'Failed to read config' })
  }
})

router.get('/readme', async (_req, res) => {
  try {
    const content = await readFile(resolve(TRADING_AGENT_DIR, 'CLAUDE.md'), 'utf8')
    res.json({ markdown: content })
  } catch (err) {
    console.error('[/api/system/readme]', err)
    res.status(500).json({ error: 'Failed to read README' })
  }
})

export default router
