import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'

export function usePositions(filters?: { status?: string; ticker?: string; themeKey?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.ticker) params.set('ticker', filters.ticker)
  if (filters?.themeKey) params.set('themeKey', filters.themeKey)
  const qs = params.toString()

  return useQuery({
    queryKey: ['positions', filters],
    queryFn: () => fetchApi<Position[]>(`/api/positions${qs ? `?${qs}` : ''}`),
    staleTime: 5 * 60_000,
  })
}

export interface Position {
  id: number
  ticker: string
  themeKey: string
  lane: string
  strategyType: string | null
  direction: string
  status: string
  openedDate: string
  closedDate: string | null
  entryPriceAvg: number | null
  exitPrice: number | null
  sizeUsd: number | null
  currentPrice: number | null
  peakPrice: number | null
  unrealizedPnlPct: number | null
  realizedPnlUsd: number | null
  realizedPnlPct: number | null
  exitRulesJson: any
  linkedSuggestion: {
    id: number
    ticker: string
    action: string
    thesis: string | null
    bullCase: string | null
    bearCase: string | null
    confidence: string | null
  } | null
  trades: Array<{
    id: number
    tradeType: string
    tradeDate: string
    quantity: number | null
    fillPrice: number | null
    valueGbp: number | null
    sizingLabel: string | null
  }>
}
