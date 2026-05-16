import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'
import type { DebateSummary } from './runs'

export function useDebates(filters?: { date?: string; ticker?: string; themeKey?: string; verdict?: string }) {
  const params = new URLSearchParams()
  if (filters?.date) params.set('date', filters.date)
  if (filters?.ticker) params.set('ticker', filters.ticker)
  if (filters?.themeKey) params.set('themeKey', filters.themeKey)
  if (filters?.verdict) params.set('verdict', filters.verdict)
  const qs = params.toString()

  return useQuery({
    queryKey: ['debates', filters],
    queryFn: () => fetchApi<DebateSummary[]>(`/api/debates${qs ? `?${qs}` : ''}`),
    staleTime: 5 * 60_000,
  })
}

export function useDebateDetail(id: number | undefined) {
  return useQuery({
    queryKey: ['debates', id],
    queryFn: () => fetchApi<DebateDetail>(`/api/debates/${id}`),
    enabled: id !== undefined,
    staleTime: 5 * 60_000,
  })
}

export interface DebateDetail {
  id: number
  runDate: string
  ticker: string
  themeKey: string
  lane: string | null
  strategyType: string | null
  regimeAtEntry: string | null
  debateRounds: number
  bullR1: any
  bearR1: any
  bullR2: any | null
  bearR2: any | null
  finalVerdict: string
  confidence: string | null
  riskDebateSummary: any | null
  screenerAction: string | null
  rejectionReason: string | null
  entryFiltersFailed: string[]
  sizingChosen: string | null
  sizingRationale: string | null
  priceAtDebate: number | null
  analystTargetAtDebate: number | null
  bearPrimaryConcern: string | null
  bullConcessions: string[]
  linkedSuggestion: any | null
  outcome: {
    realizedPnlPct: number | null
    holdingDays: number | null
    exitRuleFired: string | null
    bearWasRight: boolean | null
    outcomeNotes: string | null
  } | null
}
