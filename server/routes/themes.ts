import { Router } from 'express'
import { getActiveThemes, getThemeTimeline } from '../../../trading-agent/src/db/queries.js'
import { prisma } from '../../../trading-agent/src/db/client.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const includeRetired = req.query.includeRetired === 'true'
    const themes = includeRetired
      ? await prisma.theme.findMany({ orderBy: { updatedAt: 'desc' } })
      : await getActiveThemes()
    res.json(themes)
  } catch (err) {
    console.error('[/api/themes]', err)
    res.status(500).json({ error: 'Failed to fetch themes' })
  }
})

router.get('/:themeKey/timeline', async (req, res) => {
  try {
    const snapshots = await getThemeTimeline(req.params.themeKey)
    res.json(snapshots)
  } catch (err) {
    console.error('[/api/themes/:themeKey/timeline]', err)
    res.status(500).json({ error: 'Failed to fetch theme timeline' })
  }
})

router.get('/:themeKey', async (req, res) => {
  try {
    const theme = await prisma.theme.findUnique({
      where: { themeKey: req.params.themeKey },
    })
    if (!theme) {
      res.status(404).json({ error: 'Theme not found' })
      return
    }
    const [positions, suggestions, snapshots, proposals] = await Promise.all([
      prisma.position.findMany({
        where: { themeKey: req.params.themeKey },
        orderBy: { openedDate: 'desc' },
        include: {
          trades: { orderBy: { tradeDate: 'desc' } },
          linkedSuggestion: true,
        },
      }),
      prisma.stockSuggestion.findMany({
        where: { themeKey: req.params.themeKey },
        orderBy: { actionDate: 'desc' },
        take: 50,
      }),
      getThemeTimeline(req.params.themeKey),
      prisma.themeProposal.findMany({
        where: { themeKey: req.params.themeKey },
        orderBy: { proposedDate: 'desc' },
        take: 5,
      }),
    ])
    res.json({ ...theme, positions, suggestions, snapshots, proposals })
  } catch (err) {
    console.error('[/api/themes/:themeKey]', err)
    res.status(500).json({ error: 'Failed to fetch theme detail' })
  }
})

export default router
