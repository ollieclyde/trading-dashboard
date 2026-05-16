import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDebates, useDebateDetail } from '@/api/debates'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VERDICT_COLORS, LANE_COLORS, ACTION_COLORS } from '@/lib/constants'
import { BullR1Panel, BearR1Panel, BullR2Panel, BearR2Panel, RiskDebatePanel } from '@/components/debate/RoundPanel'

export function DebateBrowserPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tickerFilter, setTickerFilter] = useState('')
  const [verdictFilter, setVerdictFilter] = useState<string>('')

  const { data: debates, isLoading } = useDebates({
    ticker: tickerFilter || undefined,
    verdict: verdictFilter || undefined,
  })
  const debateId = id ? parseInt(id) : undefined
  const { data: detail, isLoading: detailLoading } = useDebateDetail(debateId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Debate Browser</h2>
        <input
          type="text"
          placeholder="Filter by ticker..."
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={tickerFilter}
          onChange={(e) => setTickerFilter(e.target.value)}
        />
        <Select value={verdictFilter} onValueChange={(v) => setVerdictFilter(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All verdicts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All verdicts</SelectItem>
            <SelectItem value="STRONG_AVOID">STRONG_AVOID</SelectItem>
            <SelectItem value="AVOID">AVOID</SelectItem>
            <SelectItem value="CAUTIOUS">CAUTIOUS</SelectItem>
            <SelectItem value="MANAGEABLE">MANAGEABLE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Debate list */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Debates {debates ? `(${debates.length})` : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : (
              <ScrollArea className="max-h-[calc(100vh-200px)]">
                <div className="space-y-1">
                  {debates?.map((d) => (
                    <div
                      key={d.id}
                      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm cursor-pointer transition-colors ${
                        debateId === d.id ? 'bg-accent' : 'hover:bg-accent/30'
                      }`}
                      onClick={() => navigate(`/debates/${d.id}`)}
                    >
                      <span className="font-medium w-16">{d.ticker}</span>
                      <Badge className={`text-xs ${VERDICT_COLORS[d.finalVerdict] ?? ''}`}>
                        {d.finalVerdict}
                      </Badge>
                      {d.screenerAction && (
                        <Badge className={`text-xs ${ACTION_COLORS[d.screenerAction] ?? ''}`}>
                          {d.screenerAction}
                        </Badge>
                      )}
                      {d.lane && <Badge className={`text-xs ${LANE_COLORS[d.lane] ?? ''}`}>{d.lane}</Badge>}
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(d.runDate).toISOString().split('T')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Debate detail */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {detail ? `${detail.ticker} — ${new Date(detail.runDate).toISOString().split('T')[0]}` : 'Select a debate'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <Skeleton className="h-96" />
            ) : detail ? (
              <ScrollArea className="max-h-[calc(100vh-200px)]">
                <div className="space-y-4">
                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge className={`${VERDICT_COLORS[detail.finalVerdict] ?? ''}`}>{detail.finalVerdict}</Badge>
                    {detail.lane && <Badge className={`${LANE_COLORS[detail.lane] ?? ''}`}>{detail.lane}</Badge>}
                    {detail.strategyType && <Badge variant="outline">{detail.strategyType}</Badge>}
                    {detail.confidence && <Badge variant="outline">{detail.confidence}</Badge>}
                    {detail.screenerAction && <Badge className={`${ACTION_COLORS[detail.screenerAction] ?? ''}`}>{detail.screenerAction}</Badge>}
                  </div>

                  {/* Pipeline info */}
                  <div className="text-xs space-y-1 text-muted-foreground">
                    {detail.priceAtDebate && <p>Price at debate: ${detail.priceAtDebate.toFixed(2)}</p>}
                    {detail.analystTargetAtDebate && <p>Analyst target: ${detail.analystTargetAtDebate.toFixed(2)}</p>}
                    {detail.sizingChosen && <p>Sizing: {detail.sizingChosen} — {detail.sizingRationale}</p>}
                    {detail.rejectionReason && <p className="text-red-400">Rejected: {detail.rejectionReason}</p>}
                    {detail.entryFiltersFailed.length > 0 && (
                      <p className="text-red-400">Entry filters failed: {detail.entryFiltersFailed.join(', ')}</p>
                    )}
                    {detail.bearPrimaryConcern && <p>Bear concern: {detail.bearPrimaryConcern}</p>}
                    {detail.bullConcessions.length > 0 && (
                      <p>Bull conceded: {detail.bullConcessions.join('; ')}</p>
                    )}
                  </div>

                  {/* Outcome */}
                  {detail.outcome && (
                    <div className="rounded-md border border-border p-3 text-xs space-y-1">
                      <p className="font-medium text-foreground">Outcome</p>
                      {detail.outcome.realizedPnlPct != null && (
                        <p className={detail.outcome.realizedPnlPct >= 0 ? 'text-green-400' : 'text-red-400'}>
                          P&L: {detail.outcome.realizedPnlPct.toFixed(2)}%
                        </p>
                      )}
                      {detail.outcome.holdingDays != null && <p>Held: {detail.outcome.holdingDays} days</p>}
                      {detail.outcome.exitRuleFired && <p>Exit rule: {detail.outcome.exitRuleFired}</p>}
                      {detail.outcome.bearWasRight != null && (
                        <p className={detail.outcome.bearWasRight ? 'text-red-400' : 'text-green-400'}>
                          Bear was {detail.outcome.bearWasRight ? 'right' : 'wrong'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Debate rounds */}
                  <Accordion type="multiple" defaultValue={['bull-r1', 'bear-r1']}>
                    <AccordionItem value="bull-r1">
                      <AccordionTrigger className="text-sm text-green-400">Bull R1</AccordionTrigger>
                      <AccordionContent>
                        <BullR1Panel data={detail.bullR1} />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="bear-r1">
                      <AccordionTrigger className="text-sm text-red-400">Bear R1</AccordionTrigger>
                      <AccordionContent>
                        <BearR1Panel data={detail.bearR1} />
                      </AccordionContent>
                    </AccordionItem>
                    {detail.bullR2 && (
                      <AccordionItem value="bull-r2">
                        <AccordionTrigger className="text-sm text-green-400">Bull R2 — Defense</AccordionTrigger>
                        <AccordionContent>
                          <BullR2Panel data={detail.bullR2} />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {detail.bearR2 && (
                      <AccordionItem value="bear-r2">
                        <AccordionTrigger className="text-sm text-red-400">Bear R2 — Final Verdict</AccordionTrigger>
                        <AccordionContent>
                          <BearR2Panel data={detail.bearR2} />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    {detail.riskDebateSummary && (
                      <AccordionItem value="risk">
                        <AccordionTrigger className="text-sm text-yellow-400">Risk Debate</AccordionTrigger>
                        <AccordionContent>
                          <RiskDebatePanel data={detail.riskDebateSummary} />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">Select a debate from the list</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
