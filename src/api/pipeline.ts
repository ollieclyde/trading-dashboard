import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'

export function usePipelineFunnel(from?: string, to?: string) {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const qs = params.toString()

  return useQuery({
    queryKey: ['pipeline', 'funnel', from, to],
    queryFn: () => fetchApi<PipelineFunnel>(`/api/pipeline/funnel${qs ? `?${qs}` : ''}`),
    staleTime: 5 * 60_000,
  })
}

export interface PipelineFunnel {
  totalDebated: number
  byScreenerAction: Record<string, number>
  entryFiltersHitCount: Record<string, number>
  sizingDistribution: Record<string, number>
  byVerdict: Record<string, number>
  tradesExecuted: number
}
