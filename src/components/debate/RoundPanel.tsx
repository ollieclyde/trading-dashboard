import { Badge } from '@/components/ui/badge'
import { VERDICT_COLORS, CONVICTION_COLORS } from '@/lib/constants'

export function RiskDebatePanel({ data }: { data: any }) {
  // Risk debate summary can be a string or structured object
  if (typeof data === 'string') {
    return (
      <div className="space-y-2">
        <span className="text-yellow-400 font-medium text-sm">Risk Agent Internal Debate</span>
        <p className="text-sm text-foreground whitespace-pre-wrap">{data}</p>
      </div>
    )
  }
  // Structured: render key fields
  return (
    <div className="space-y-2">
      <span className="text-yellow-400 font-medium text-sm">Risk Agent Internal Debate</span>
      <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}

interface BullR1 {
  ticker: string
  bull_case: string
  catalyst: string
  upside_scenario: string
  supporting_evidence: string[]
  sentiment_signal: string
  conviction: string
  entry_rationale: string
  kill_condition: string
}

interface BearR1 {
  ticker: string
  bear_case: string
  fatal_flaw: string
  crowded_trade_risk: string
  crowded_reddit_risk?: string
  short_squeeze_risk?: string
  downside_scenario: string
  rebuttal_points: string[]
  fatal_flaw_probability: number
  expected_downside_pct: number
  verdict: string
}

interface BullR2 {
  ticker: string
  fatal_flaw_response: string
  rebuttal_responses: Array<{ point: string; response: string }>
  conceded_points: string[]
  thesis_held: boolean
  updated_conviction: string
  updated_bull_case: string
  updated_kill_condition: string
}

interface BearR2 {
  ticker: string
  defense_assessment: string
  outstanding_risks: string[]
  kill_condition_adequate: boolean
  updated_fatal_flaw_probability: number
  updated_expected_downside_pct: number
  verdict_changed: boolean
  final_verdict: string
  final_bear_case: string
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-0.5 text-sm text-foreground">{children}</div>
    </div>
  )
}

export function BullR1Panel({ data }: { data: BullR1 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-400 font-medium text-sm">Bull R1</span>
        <Badge className={`text-xs ${CONVICTION_COLORS[data.conviction] ?? ''}`}>{data.conviction}</Badge>
        <Badge variant="outline" className="text-xs">{data.sentiment_signal}</Badge>
      </div>
      <Field label="Bull Case">{data.bull_case}</Field>
      <Field label="Catalyst">{data.catalyst}</Field>
      <Field label="Upside Scenario">{data.upside_scenario}</Field>
      <Field label="Entry Rationale">{data.entry_rationale}</Field>
      <div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Supporting Evidence</span>
        <ul className="mt-0.5 space-y-0.5">
          {data.supporting_evidence.map((e, i) => (
            <li key={i} className="text-sm text-foreground flex gap-2">
              <span className="text-muted-foreground shrink-0">-</span>{e}
            </li>
          ))}
        </ul>
      </div>
      <Field label="Kill Condition">
        <span className="text-yellow-400">{data.kill_condition}</span>
      </Field>
    </div>
  )
}

export function BearR1Panel({ data }: { data: BearR1 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400 font-medium text-sm">Bear R1</span>
        <Badge className={`text-xs ${VERDICT_COLORS[data.verdict] ?? ''}`}>{data.verdict}</Badge>
        <span className="text-xs text-muted-foreground">
          Fatal flaw: {(data.fatal_flaw_probability * 100).toFixed(0)}% probability
        </span>
      </div>
      <Field label="Bear Case">{data.bear_case}</Field>
      <Field label="Fatal Flaw">
        <span className="text-red-300">{data.fatal_flaw}</span>
      </Field>
      <Field label="Downside Scenario">
        {data.downside_scenario}
        <span className="text-red-400 ml-2 text-xs">({data.expected_downside_pct}%)</span>
      </Field>
      <div className="flex gap-4 text-xs">
        <span>Crowded trade risk: <span className="text-foreground">{data.crowded_trade_risk}</span></span>
        {data.crowded_reddit_risk && (
          <span>Reddit risk: <span className="text-foreground">{data.crowded_reddit_risk}</span></span>
        )}
        {data.short_squeeze_risk && (
          <span>Short squeeze: <span className="text-foreground">{data.short_squeeze_risk}</span></span>
        )}
      </div>
      <div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Rebuttal Points</span>
        <ul className="mt-0.5 space-y-0.5">
          {data.rebuttal_points.map((p, i) => (
            <li key={i} className="text-sm text-foreground flex gap-2">
              <span className="text-muted-foreground shrink-0">-</span>{p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function BullR2Panel({ data }: { data: BullR2 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green-400 font-medium text-sm">Bull R2 — Defense</span>
        <Badge className={`text-xs ${CONVICTION_COLORS[data.updated_conviction] ?? ''}`}>
          {data.updated_conviction}
        </Badge>
        {!data.thesis_held && (
          <Badge className="text-xs bg-red-800/30 text-red-400">Thesis Abandoned</Badge>
        )}
      </div>
      <Field label="Fatal Flaw Response">{data.fatal_flaw_response}</Field>
      <Field label="Updated Bull Case">{data.updated_bull_case}</Field>
      <div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Rebuttal Responses</span>
        <div className="mt-1 space-y-2">
          {data.rebuttal_responses.map((r, i) => (
            <div key={i} className="rounded border border-border/50 p-2 text-sm">
              <p className="text-xs text-red-400 mb-1">"{r.point}"</p>
              <p className="text-foreground">{r.response}</p>
            </div>
          ))}
        </div>
      </div>
      {data.conceded_points.length > 0 && (
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-yellow-400">Conceded Points</span>
          <ul className="mt-0.5 space-y-0.5">
            {data.conceded_points.map((p, i) => (
              <li key={i} className="text-sm text-yellow-300/80 flex gap-2">
                <span className="shrink-0">!</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Field label="Updated Kill Condition">
        <span className="text-yellow-400">{data.updated_kill_condition}</span>
      </Field>
    </div>
  )
}

export function BearR2Panel({ data }: { data: BearR2 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400 font-medium text-sm">Bear R2 — Final Verdict</span>
        <Badge className={`text-xs ${VERDICT_COLORS[data.final_verdict] ?? ''}`}>{data.final_verdict}</Badge>
        {data.verdict_changed && (
          <Badge variant="outline" className="text-xs">Verdict changed</Badge>
        )}
        <span className="text-xs text-muted-foreground">
          Fatal flaw: {(data.updated_fatal_flaw_probability * 100).toFixed(0)}% | Downside: {data.updated_expected_downside_pct}%
        </span>
      </div>
      <Field label="Defense Assessment">{data.defense_assessment}</Field>
      <Field label="Final Bear Case">{data.final_bear_case}</Field>
      <div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Outstanding Risks</span>
        <ul className="mt-0.5 space-y-0.5">
          {data.outstanding_risks.map((r, i) => (
            <li key={i} className="text-sm text-red-300/80 flex gap-2">
              <span className="text-red-400 shrink-0">-</span>{r}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-xs text-muted-foreground">
        Kill condition adequate: <span className={data.kill_condition_adequate ? 'text-green-400' : 'text-red-400'}>
          {data.kill_condition_adequate ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  )
}
