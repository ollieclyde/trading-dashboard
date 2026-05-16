import { Router } from 'express'
import { prisma } from '../../../trading-agent/src/db/client.js'

const router = Router()

router.get('/funnel', async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from as string + 'T00:00:00.000Z') : undefined
    const to = req.query.to ? new Date(req.query.to as string + 'T00:00:00.000Z') : undefined

    const dateFilter = {
      ...(from && { gte: from }),
      ...(to && { lte: to }),
    }
    const hasDateFilter = Object.keys(dateFilter).length > 0

    const [debates, trades] = await Promise.all([
      prisma.debateTranscript.findMany({
        where: hasDateFilter ? { runDate: dateFilter } : {},
        select: {
          screenerAction: true,
          entryFiltersFailed: true,
          sizingChosen: true,
          finalVerdict: true,
        },
      }),
      prisma.trade.findMany({
        where: {
          tradeType: 'BUY',
          ...(hasDateFilter ? { tradeDate: dateFilter } : {}),
        },
        select: { id: true },
      }),
    ])

    const totalDebated = debates.length
    const byScreenerAction: Record<string, number> = {}
    const entryFiltersHitCount: Record<string, number> = {}
    const sizingDistribution: Record<string, number> = {}
    const byVerdict: Record<string, number> = {}

    for (const d of debates) {
      const action = d.screenerAction ?? 'UNKNOWN'
      byScreenerAction[action] = (byScreenerAction[action] ?? 0) + 1

      for (const f of d.entryFiltersFailed) {
        entryFiltersHitCount[f] = (entryFiltersHitCount[f] ?? 0) + 1
      }

      if (d.sizingChosen) {
        sizingDistribution[d.sizingChosen] = (sizingDistribution[d.sizingChosen] ?? 0) + 1
      }

      byVerdict[d.finalVerdict] = (byVerdict[d.finalVerdict] ?? 0) + 1
    }

    res.json({
      totalDebated,
      byScreenerAction,
      entryFiltersHitCount,
      sizingDistribution,
      byVerdict,
      tradesExecuted: trades.length,
    })
  } catch (err) {
    console.error('[/api/pipeline/funnel]', err)
    res.status(500).json({ error: 'Failed to compute pipeline funnel' })
  }
})

export default router
