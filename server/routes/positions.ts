import { Router } from 'express'
import { getAllPositions } from '../../../trading-agent/src/db/queries.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { status, ticker, themeKey } = req.query
    const positions = await getAllPositions({
      status: status as string | undefined,
      ticker: ticker as string | undefined,
      themeKey: themeKey as string | undefined,
    })
    res.json(positions)
  } catch (err) {
    console.error('[/api/positions]', err)
    res.status(500).json({ error: 'Failed to fetch positions' })
  }
})

export default router
