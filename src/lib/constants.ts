export const VERDICT_COLORS: Record<string, string> = {
  STRONG_AVOID: 'bg-red-900/50 text-red-300',
  AVOID: 'bg-red-800/30 text-red-400',
  CAUTIOUS: 'bg-yellow-800/30 text-yellow-400',
  MANAGEABLE: 'bg-green-800/30 text-green-400',
}

export const LANE_COLORS: Record<string, string> = {
  TACTICAL: 'bg-orange-800/30 text-orange-400',
  STRATEGIC: 'bg-blue-800/30 text-blue-400',
}

export const LIFECYCLE_COLORS: Record<string, string> = {
  EMERGING: 'bg-cyan-800/30 text-cyan-400',
  GROWING: 'bg-green-800/30 text-green-400',
  ACTIVE: 'bg-green-800/30 text-green-400',
  MATURE: 'bg-yellow-800/30 text-yellow-400',
  DECLINING: 'bg-orange-800/30 text-orange-400',
  RETIREMENT_ELIGIBLE: 'bg-red-800/30 text-red-400',
  RETIRED: 'bg-zinc-800/30 text-zinc-500',
}

export const CONVICTION_COLORS: Record<string, string> = {
  HIGH: 'bg-green-800/30 text-green-400',
  MEDIUM: 'bg-yellow-800/30 text-yellow-400',
  LOW: 'bg-red-800/30 text-red-400',
}

export const ACTION_COLORS: Record<string, string> = {
  ADD: 'bg-green-800/30 text-green-400',
  UPDATE: 'bg-blue-800/30 text-blue-400',
  RETIRE: 'bg-red-800/30 text-red-400',
  INCREASE: 'bg-emerald-800/30 text-emerald-400',
  EXCLUDED: 'bg-zinc-800/30 text-zinc-500',
}

export const STATUS_COLORS: Record<string, string> = {
  STRENGTHENING: 'text-green-400',
  NEUTRAL: 'text-zinc-400',
  WEAKENING: 'text-red-400',
}

// Reserved for future "regime" tagging in the analytics layer. Not yet
// surfaced in the UI — added now so the analytics pipeline can start
// emitting these keys safely.
export const REGIME_COLORS: Record<string, string> = {
  BULL: 'bg-green-700/30 text-green-300',
  BEAR: 'bg-red-700/30 text-red-300',
  CHOP: 'bg-yellow-700/30 text-yellow-300',
  TREND: 'bg-blue-700/30 text-blue-300',
}
