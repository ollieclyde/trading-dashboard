import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'

export function useReflections() {
  return useQuery({
    queryKey: ['reflections'],
    queryFn: () => fetchApi<Reflection[]>('/api/reflections'),
    staleTime: 5 * 60_000,
  })
}

export function useReflection(weekLabel: string | undefined) {
  return useQuery({
    queryKey: ['reflections', weekLabel],
    queryFn: () => fetchApi<Reflection>(`/api/reflections/${weekLabel}`),
    enabled: !!weekLabel,
    staleTime: 5 * 60_000,
  })
}

export interface Reflection {
  id: number
  weekLabel: string
  periodStart: string
  periodEnd: string
  closedPositionsCount: number
  confidenceCalibration: Record<string, { count: number; avg_return_pct: number }>
  positionReviews: any[]
  themeLessons: any[]
  systemLessons: string[]
  openPositionFlags: any[]
  riskCalibration: any | null
  nextWeekWatch: string | null
}
