import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'

export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: () => fetchApi<Theme[]>('/api/themes'),
    staleTime: 5 * 60_000,
  })
}

export function useThemeTimeline(themeKey: string | undefined) {
  return useQuery({
    queryKey: ['themes', themeKey, 'timeline'],
    queryFn: () => fetchApi<ThemeSnapshot[]>(`/api/themes/${themeKey}/timeline`),
    enabled: !!themeKey,
    staleTime: 5 * 60_000,
  })
}

export function useThemeDetail(themeKey: string | undefined) {
  return useQuery({
    queryKey: ['themes', themeKey],
    queryFn: () => fetchApi<ThemeDetail>(`/api/themes/${themeKey}`),
    enabled: !!themeKey,
    staleTime: 5 * 60_000,
  })
}

export interface Theme {
  themeKey: string
  name: string
  lane: string
  lifecycle: string
  conviction: string | null
  status: string | null
  exhaustionScore: number | null
  firstIdentified: string | null
  summary: string | null
  searchQueries: string[]
  keyEvents: any[]
}

export interface ThemeSnapshot {
  id: number
  snapshotDate: string
  themeKey: string
  lifecycle: string
  conviction: string | null
  exhaustionScore: number | null
  status: string | null
  summary: string | null
}

export interface ThemeDetail extends Theme {
  positions: any[]
  suggestions: any[]
  snapshots: ThemeSnapshot[]
  proposals: Array<{
    id: string
    themeKey: string
    proposedDate: string
    title: string
    rationale: string | null
    status: string
  }>
}
