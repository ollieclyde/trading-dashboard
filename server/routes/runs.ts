import { Router } from 'express'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { getRunDates, getRunDetail } from '../../../trading-agent/src/db/queries.js'

const REPORTS_DIR = resolve(import.meta.dirname, '../../../trading-agent/reports/daily')

const router = Router()

router.get('/dates', async (_req, res) => {
  try {
    const dates = await getRunDates()
    res.json({ dates: dates.map(d => d.toISOString().split('T')[0]) })
  } catch (err) {
    console.error('[/api/runs/dates]', err)
    res.status(500).json({ error: 'Failed to fetch run dates' })
  }
})

router.get('/:date/brief', async (req, res) => {
  try {
    const filePath = resolve(REPORTS_DIR, `${req.params.date}.md`)
    const content = await readFile(filePath, 'utf8')
    res.json({ date: req.params.date, markdown: content })
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      res.status(404).json({ error: 'No brief found for this date' })
      return
    }
    console.error('[/api/runs/:date/brief]', err)
    res.status(500).json({ error: 'Failed to read brief' })
  }
})

router.get('/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date + 'T00:00:00.000Z')
    if (isNaN(date.getTime())) {
      res.status(400).json({ error: 'Invalid date format' })
      return
    }
    const detail = await getRunDetail(date)
    res.json({ date: req.params.date, ...detail })
  } catch (err) {
    console.error('[/api/runs/:date]', err)
    res.status(500).json({ error: 'Failed to fetch run detail' })
  }
})

export default router
