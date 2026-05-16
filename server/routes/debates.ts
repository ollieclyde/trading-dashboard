import { Router } from 'express'
import { getDebateHistory, getDebateById } from '../../../trading-agent/src/db/queries.js'
import { prisma } from '../../../trading-agent/src/db/client.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { date, ticker, themeKey, verdict } = req.query
    const where: Record<string, any> = {}
    if (date) where.runDate = new Date(date as string + 'T00:00:00.000Z')
    if (ticker) where.ticker = { contains: ticker as string, mode: 'insensitive' }
    if (themeKey) where.themeKey = themeKey as string
    if (verdict) where.finalVerdict = verdict as string

    const debates = await prisma.debateTranscript.findMany({
      where,
      select: {
        id: true,
        runDate: true,
        ticker: true,
        themeKey: true,
        lane: true,
        strategyType: true,
        finalVerdict: true,
        confidence: true,
        screenerAction: true,
        rejectionReason: true,
        entryFiltersFailed: true,
        sizingChosen: true,
        priceAtDebate: true,
        bearPrimaryConcern: true,
        debateRounds: true,
        outcome: {
          select: {
            realizedPnlPct: true,
            bearWasRight: true,
            exitRuleFired: true,
          },
        },
      },
      orderBy: { runDate: 'desc' },
      take: 100,
    })
    res.json(debates)
  } catch (err) {
    console.error('[/api/debates]', err)
    res.status(500).json({ error: 'Failed to fetch debates' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid debate ID' })
      return
    }
    const debate = await getDebateById(id)
    if (!debate) {
      res.status(404).json({ error: 'Debate not found' })
      return
    }
    res.json(debate)
  } catch (err) {
    console.error('[/api/debates/:id]', err)
    res.status(500).json({ error: 'Failed to fetch debate' })
  }
})

export default router
