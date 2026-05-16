import { Router } from 'express'
import { getAllReflections } from '../../../trading-agent/src/db/queries.js'
import { prisma } from '../../../trading-agent/src/db/client.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const reflections = await getAllReflections()
    res.json(reflections)
  } catch (err) {
    console.error('[/api/reflections]', err)
    res.status(500).json({ error: 'Failed to fetch reflections' })
  }
})

router.get('/:weekLabel', async (req, res) => {
  try {
    const reflection = await prisma.reflection.findUnique({
      where: { weekLabel: req.params.weekLabel },
    })
    if (!reflection) {
      res.status(404).json({ error: 'Reflection not found' })
      return
    }
    res.json(reflection)
  } catch (err) {
    console.error('[/api/reflections/:weekLabel]', err)
    res.status(500).json({ error: 'Failed to fetch reflection' })
  }
})

export default router
