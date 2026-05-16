import { useQuery } from '@tanstack/react-query'
import { fetchApi } from './client'

export function useConfig() {
  return useQuery({
    queryKey: ['system', 'config'],
    queryFn: () => fetchApi<SystemConfig>('/api/system/config'),
    staleTime: Infinity,
  })
}

export function useReadme() {
  return useQuery({
    queryKey: ['system', 'readme'],
    queryFn: () => fetchApi<{ markdown: string }>('/api/system/readme'),
    staleTime: Infinity,
  })
}

export interface SystemConfig {
  lifecycle: {
    tactical: LaneConfig
    strategic: LaneConfig
  }
  trading: {
    enabled: boolean
    account: string
    sizing: Record<string, number>
    maxDailyDeploymentGbp: number | null
  }
  portfolio: {
    maxInvestedPct: number
    maxCorrelatedClusterPct: number
    maxHedgeTotalPct: number
    minCashReservePct: number
    tactical: PortfolioLaneConfig
    strategic: PortfolioLaneConfig
  }
  entry: {
    minUpsideToAnalystTargetPct: number
    rejectAtOrAboveAnalystTarget: boolean
    maxPctOf52wHighAtEntry: number
    requireSma200AboveForStrategic: boolean
    maxExtensionAboveSma200Pct: number
  }
  exit: {
    healthScore: {
      enabled: boolean
      tactical: { exitThreshold: number; approachingThreshold: number }
      strategic: { exitThreshold: number; approachingThreshold: number }
    }
  }
  volatility: {
    crisisThreshold: number
    elevatedThreshold: number
    lowThreshold: number
    tacticalPauseOnCrisis: boolean
    widenStopsPctOnElevated: number
  }
  eventCalendar: {
    tacticalGateHoursBeforeHighImpact: number
    tacticalGateHoursAfterHighImpact: number
    highImpactEvents: string[]
    gateAppliesTo: string[]
  }
  creditSpreads: {
    hyOasElevatedBps: number
    hyOasStressBps: number
    hyOasCrisisBps: number
    rejectSpeculativeOnStress: boolean
  }
}

interface LaneConfig {
  maxActiveThemes: number
  validationDaysRequired: number
  instantPromoteOnHighConviction: boolean
  minDaysActiveBeforeRetirement: number
  exhaustionThresholdForDeclining: number
  daysDeclingBeforeRetirementEligible: number
  proposalExpiryDays: number
  signalWindowDays: number
  hardTimeCapDays: number | null
  autoDeclineAfterDays: number | null
  lifecycleStates: string[]
}

interface PortfolioLaneConfig {
  maxTotalPct: number
  maxSinglePositionPct: number
  maxSingleThemePct: number
  maxSpeculativePct: number
  defaultStopLossPct: number
  defaultTakeProfitPct: number | null
  maxTimeDecayDays: number | null
}
