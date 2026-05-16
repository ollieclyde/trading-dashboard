import { useState } from 'react'
import { useConfig, useReadme } from '@/api/system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MarkdownHooks as Markdown } from 'react-markdown'

function ConfigValue({ label, value, unit }: { label: string; value: any; unit?: string }) {
  const display = value === null ? 'None' : value === true ? 'Yes' : value === false ? 'No' : `${value}${unit ?? ''}`
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/30">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{display}</span>
    </div>
  )
}

function LaneComparison({ config }: { config: any }) {
  const t = config.lifecycle.tactical
  const s = config.lifecycle.strategic
  const pt = config.portfolio.tactical
  const ps = config.portfolio.strategic

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Tactical */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge className="bg-orange-800/30 text-orange-400">TACTICAL</Badge>
            Event-driven, days to 6 weeks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-xs text-muted-foreground mb-3">
            Short-term trades around catalysts, earnings, geopolitical events. Fast in, fast out. Binary outcomes.
          </p>
          <Separator className="my-2" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Theme Lifecycle</p>
          <ConfigValue label="Max active themes" value={t.maxActiveThemes} />
          <ConfigValue label="Validation days" value={t.validationDaysRequired} />
          <ConfigValue label="Instant promote on HIGH" value={t.instantPromoteOnHighConviction} />
          <ConfigValue label="Hard time cap" value={t.hardTimeCapDays} unit=" days" />
          <ConfigValue label="Auto-decline after" value={t.autoDeclineAfterDays} unit=" days" />
          <ConfigValue label="Proposal expiry" value={t.proposalExpiryDays} unit=" days" />
          <ConfigValue label="Exhaustion → DECLINING" value={`${(t.exhaustionThresholdForDeclining * 100).toFixed(0)}%`} />
          <ConfigValue label="Lifecycle states" value={t.lifecycleStates.join(' → ')} />
          <Separator className="my-2" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Portfolio Limits</p>
          <ConfigValue label="Max total allocation" value={pt.maxTotalPct} unit="%" />
          <ConfigValue label="Max single position" value={pt.maxSinglePositionPct} unit="%" />
          <ConfigValue label="Max single theme" value={pt.maxSingleThemePct} unit="%" />
          <ConfigValue label="Max speculative" value={pt.maxSpeculativePct} unit="%" />
          <ConfigValue label="Default stop-loss" value={pt.defaultStopLossPct} unit="%" />
          <ConfigValue label="Default take-profit" value={pt.defaultTakeProfitPct} unit="%" />
          <ConfigValue label="Max time decay" value={pt.maxTimeDecayDays} unit=" days" />
        </CardContent>
      </Card>

      {/* Strategic */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge className="bg-blue-800/30 text-blue-400">STRATEGIC</Badge>
            Macro rotations, 1-6 months
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <p className="text-xs text-muted-foreground mb-3">
            Structural themes driven by macro regimes, sector rotation, and multi-month narratives. Higher conviction, larger positions.
          </p>
          <Separator className="my-2" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Theme Lifecycle</p>
          <ConfigValue label="Max active themes" value={s.maxActiveThemes} />
          <ConfigValue label="Validation days" value={s.validationDaysRequired} />
          <ConfigValue label="Instant promote on HIGH" value={s.instantPromoteOnHighConviction} />
          <ConfigValue label="Hard time cap" value={s.hardTimeCapDays} />
          <ConfigValue label="Auto-decline after" value={s.autoDeclineAfterDays} />
          <ConfigValue label="Proposal expiry" value={s.proposalExpiryDays} unit=" days" />
          <ConfigValue label="Exhaustion → DECLINING" value={`${(s.exhaustionThresholdForDeclining * 100).toFixed(0)}%`} />
          <ConfigValue label="Lifecycle states" value={s.lifecycleStates.join(' → ')} />
          <Separator className="my-2" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Portfolio Limits</p>
          <ConfigValue label="Max total allocation" value={ps.maxTotalPct} unit="%" />
          <ConfigValue label="Max single position" value={ps.maxSinglePositionPct} unit="%" />
          <ConfigValue label="Max single theme" value={ps.maxSingleThemePct} unit="%" />
          <ConfigValue label="Max speculative" value={ps.maxSpeculativePct} unit="%" />
          <ConfigValue label="Default stop-loss" value={ps.defaultStopLossPct} unit="%" />
          <ConfigValue label="Default take-profit" value={ps.defaultTakeProfitPct} />
          <ConfigValue label="Max time decay" value={ps.maxTimeDecayDays} />
        </CardContent>
      </Card>
    </div>
  )
}

export function SystemPage() {
  const [tab, setTab] = useState('config')
  const { data: config, isLoading: configLoading } = useConfig()
  const { data: readme, isLoading: readmeLoading } = useReadme()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">System Configuration</h2>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="config">Config</TabsTrigger>
          <TabsTrigger value="readme">System Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mt-4 space-y-6">
          {configLoading ? (
            <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />)}</div>
          ) : config ? (
            <>
              {/* Lane comparison */}
              <LaneComparison config={config} />

              <div className="grid gap-4 md:grid-cols-2">
                {/* Portfolio-wide limits */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Portfolio-Wide Limits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <ConfigValue label="Max invested" value={config.portfolio.maxInvestedPct} unit="%" />
                    <ConfigValue label="Max correlated cluster" value={config.portfolio.maxCorrelatedClusterPct} unit="%" />
                    <ConfigValue label="Max hedge total" value={config.portfolio.maxHedgeTotalPct} unit="%" />
                    <ConfigValue label="Min cash reserve" value={config.portfolio.minCashReservePct} unit="%" />
                  </CardContent>
                </Card>

                {/* Entry discipline */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Entry Discipline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-xs text-muted-foreground mb-2">
                      Hard mechanical filters that cannot be overridden by bull conviction.
                    </p>
                    <ConfigValue label="Min upside to analyst target" value={config.entry.minUpsideToAnalystTargetPct} unit="%" />
                    <ConfigValue label="Reject at/above analyst target" value={config.entry.rejectAtOrAboveAnalystTarget} />
                    <ConfigValue label="Max % of 52-week high" value={config.entry.maxPctOf52wHighAtEntry} unit="%" />
                    <ConfigValue label="Require SMA200 support (strategic)" value={config.entry.requireSma200AboveForStrategic} />
                    <ConfigValue label="Max extension above SMA200" value={config.entry.maxExtensionAboveSma200Pct} unit="%" />
                  </CardContent>
                </Card>

                {/* Trading config */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Trading</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <ConfigValue label="Trading enabled" value={config.trading.enabled} />
                    <ConfigValue label="Account mode" value={config.trading.account} />
                    <ConfigValue label="Max daily deployment" value={config.trading.maxDailyDeploymentGbp} />
                    <Separator className="my-2" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Sizing (% of portfolio)</p>
                    <ConfigValue label="Full" value={(config.trading.sizing.full * 100).toFixed(0)} unit="%" />
                    <ConfigValue label="Reduced" value={(config.trading.sizing.reduced * 100).toFixed(0)} unit="%" />
                    <ConfigValue label="Small" value={(config.trading.sizing.small * 100).toFixed(0)} unit="%" />
                  </CardContent>
                </Card>

                {/* Volatility thresholds */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Volatility Regime</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <ConfigValue label="Crisis (VIX >)" value={config.volatility.crisisThreshold} />
                    <ConfigValue label="Elevated (VIX >)" value={config.volatility.elevatedThreshold} />
                    <ConfigValue label="Low (VIX <)" value={config.volatility.lowThreshold} />
                    <ConfigValue label="Pause tactical on crisis" value={config.volatility.tacticalPauseOnCrisis} />
                    <ConfigValue label="Widen stops on elevated" value={config.volatility.widenStopsPctOnElevated} unit="%" />
                  </CardContent>
                </Card>

                {/* Event calendar gates */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Event Calendar Gates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-xs text-muted-foreground mb-2">
                      Blocks new entries around high-impact macro releases.
                    </p>
                    <ConfigValue label="Gate before event" value={config.eventCalendar.tacticalGateHoursBeforeHighImpact} unit="h" />
                    <ConfigValue label="Gate after event" value={config.eventCalendar.tacticalGateHoursAfterHighImpact} unit="h" />
                    <ConfigValue label="High impact events" value={config.eventCalendar.highImpactEvents.join(', ')} />
                    <ConfigValue label="Applies to" value={config.eventCalendar.gateAppliesTo.join(', ')} />
                  </CardContent>
                </Card>

                {/* Credit spread thresholds */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Credit Spreads</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <ConfigValue label="HY OAS Elevated" value={config.creditSpreads.hyOasElevatedBps} unit=" bps" />
                    <ConfigValue label="HY OAS Stress" value={config.creditSpreads.hyOasStressBps} unit=" bps" />
                    <ConfigValue label="HY OAS Crisis" value={config.creditSpreads.hyOasCrisisBps} unit=" bps" />
                    <ConfigValue label="Reject speculative on stress" value={config.creditSpreads.rejectSpeculativeOnStress} />
                  </CardContent>
                </Card>

                {/* Health score */}
                <Card className="md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Exit Health Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Composite 0-100 score per position. Below exit threshold triggers mechanical RETIRE. Penalties stack.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div>
                        <p className="text-xs font-medium text-orange-400 mb-1">Tactical</p>
                        <ConfigValue label="Exit threshold" value={config.exit.healthScore.tactical.exitThreshold} unit="/100" />
                        <ConfigValue label="Approaching threshold" value={config.exit.healthScore.tactical.approachingThreshold} unit="/100" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blue-400 mb-1">Strategic</p>
                        <ConfigValue label="Exit threshold" value={config.exit.healthScore.strategic.exitThreshold} unit="/100" />
                        <ConfigValue label="Approaching threshold" value={config.exit.healthScore.strategic.approachingThreshold} unit="/100" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="readme" className="mt-4">
          {readmeLoading ? (
            <Skeleton className="h-96" />
          ) : readme ? (
            <Card>
              <CardContent className="pt-6 markdown-body text-sm text-muted-foreground">
                <Markdown>{readme.markdown}</Markdown>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No system guide found
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
