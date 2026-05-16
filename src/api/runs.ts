import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'

export function useRunDates() {
  return useQuery({
    queryKey: ['runs', 'dates'],
    queryFn: () => fetchApi<{ dates: string[] }>('/api/runs/dates'),
    staleTime: 5 * 60_000,
  })
}

export function useRunBrief(date: string | undefined) {
  return useQuery({
    queryKey: ['runs', date, 'brief'],
    queryFn: () => fetchApi<{ date: string; markdown: string }>(`/api/runs/${date}/brief`),
    enabled: !!date,
    staleTime: 5 * 60_000,
  })
}

export function useRunDetail(date: string | undefined) {
  return useQuery({
    queryKey: ['runs', date],
    queryFn: () => fetchApi<RunDetail>(`/api/runs/${date}`),
    enabled: !!date,
    staleTime: 5 * 60_000,
  })
}

// Types for the run detail response
export interface RunDetail {
  date: string
  log: {
    macroRegime: string | null
    dominantEvent: string | null
    themesActive: string[]
    stocksAdded: string[]
    stocksRetired: string[]
    notes: string | null
  } | null
  insight: {
    geoPulseBullets: string[]
    warningsFlagged: any[] | null
    predictionsWatch: any[] | null
    thesisChanges: any[] | null
    regimeFitCalls: any[] | null
    keyDecisions: string[]
  } | null
  proposals: Array<{
    id: string
    themeKey: string
    lane: string
    proposedDate: string
    title: string
    rationale: string | null
    validationDays: number
    status: string
  }>
  debates: Array<DebateSummary>
  suggestions: Array<{
    id: number
    ticker: string
    themeKey: string
    action: string
    actionDate: string
    confidence: string | null
    priceAtAction: number | null
    thesis: string | null
    bullCase: string | null
    bearCase: string | null
    sizing: string | null
    lane: string | null
    strategyType: string | null
  }>
  trades: Array<{
    id: number
    ticker: string
    tradeType: string
    tradeDate: string
    quantity: number | null
    fillPrice: number | null
    valueGbp: number | null
    sizingLabel: string | null
    t212Status: string | null
    position: {
      id: number
      ticker: string
      status: string
      unrealizedPnlPct: number | null
    }
  }>
  themeSnapshots: Array<{
    themeKey: string
    lifecycle: string
    conviction: string | null
    exhaustionScore: number | null
    status: string | null
    summary: string | null
    theme: {
      name: string
      summary: string | null
    }
  }>
}

export interface DebateSummary {
  id: number
  runDate: string
  ticker: string
  themeKey: string
  lane: string | null
  strategyType: string | null
  finalVerdict: string
  confidence: string | null
  screenerAction: string | null
  rejectionReason: string | null
  entryFiltersFailed: string[]
  sizingChosen: string | null
  priceAtDebate: number | null
  bearPrimaryConcern: string | null
  debateRounds: number
  outcome: {
    realizedPnlPct: number | null
    bearWasRight: boolean | null
    exitRuleFired: string | null
  } | null
}
