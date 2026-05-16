import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRunDates, useRunDetail, useRunBrief } from '@/api/runs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MarkdownHooks as Markdown } from 'react-markdown'
import { VERDICT_COLORS, LANE_COLORS, ACTION_COLORS, CONVICTION_COLORS, LIFECYCLE_COLORS } from '@/lib/constants'

export function RunExplorerPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const { data: datesData, isLoading: datesLoading } = useRunDates()
  const dates = datesData?.dates ?? []
  const selectedDate = date ?? dates[0]
  const { data: run, isLoading: runLoading } = useRunDetail(selectedDate)
  const { data: brief, isLoading: briefLoading } = useRunBrief(tab === 'brief' ? selectedDate : undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Run Explorer</h2>
        {datesLoading ? (
          <Skeleton className="h-9 w-44" />
        ) : (
          <Select value={selectedDate} onValueChange={(v) => navigate(`/runs/${v}`)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="brief">Full Brief</TabsTrigger>
        </TabsList>

        <TabsContent value="brief" className="mt-4">
          {briefLoading ? (
            <Skeleton className="h-96" />
          ) : brief ? (
            <Card>
              <CardContent className="pt-6 markdown-body text-sm text-muted-foreground">
                <Markdown>{brief.markdown}</Markdown>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No brief found for {selectedDate}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="overview" className="mt-4">
      {runLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : run ? (
        <div className="space-y-4">
          {/* Run Header */}
          {run.log && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {selectedDate}
                  {run.log.macroRegime && (
                    <Badge variant="outline">{run.log.macroRegime}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {run.log.dominantEvent && (
                  <p className="text-muted-foreground">{run.log.dominantEvent}</p>
                )}
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">
                    Themes active: <span className="text-foreground">{run.log.themesActive.length}</span>
                  </span>
                  {run.log.stocksAdded.length > 0 && (
                    <span className="text-green-400">
                      +{run.log.stocksAdded.join(', ')}
                    </span>
                  )}
                  {run.log.stocksRetired.length > 0 && (
                    <span className="text-red-400">
                      -{run.log.stocksRetired.join(', ')}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Key Decisions */}
            {run.insight && run.insight.keyDecisions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Key Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {run.insight.keyDecisions.map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-foreground shrink-0">-</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Geo Pulse */}
            {run.insight && run.insight.geoPulseBullets.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Geo Pulse</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {run.insight.geoPulseBullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {run.insight?.warningsFlagged && Array.isArray(run.insight.warningsFlagged) && run.insight.warningsFlagged.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Warnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {run.insight.warningsFlagged.map((w: any, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{w.ticker}</Badge>
                        <span className="text-muted-foreground">{w.warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* World Scanner Proposals */}
            {run.proposals.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">World Scanner Proposals</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {run.proposals.map((p) => (
                      <li key={p.id} className="flex items-start gap-2">
                        <Badge className={`text-xs shrink-0 ${LANE_COLORS[p.lane] ?? ''}`}>
                          {p.lane}
                        </Badge>
                        <div>
                          <span className="text-foreground">{p.title}</span>
                          {p.rationale && (
                            <p className="text-xs text-muted-foreground mt-0.5">{p.rationale}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Theme Snapshots */}
          {run.themeSnapshots.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Themes Active ({run.themeSnapshots.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {run.themeSnapshots.map((s) => (
                    <div
                      key={s.themeKey}
                      className="rounded-md border border-border p-3 text-sm space-y-1.5 cursor-pointer hover:bg-accent/30 transition-colors"
                      onClick={() => navigate(`/themes/${s.themeKey}`)}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{s.theme?.name ?? s.themeKey}</span>
                        <Badge className={`text-xs ${LIFECYCLE_COLORS[s.lifecycle] ?? ''}`}>
                          {s.lifecycle}
                        </Badge>
                      </div>
                      <div className="flex gap-2 text-xs">
                        {s.conviction && (
                          <Badge className={`text-xs ${CONVICTION_COLORS[s.conviction] ?? ''}`}>
                            {s.conviction}
                          </Badge>
                        )}
                        {s.exhaustionScore != null && (
                          <span className="text-muted-foreground">
                            Exhaust: {(s.exhaustionScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                      {(s.summary || s.theme?.summary) && (
                        <p className="text-xs text-muted-foreground line-clamp-3">{s.summary ?? s.theme?.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debates */}
          {run.debates.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Debates ({run.debates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[500px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3">Ticker</th>
                        <th className="pb-2 pr-3">Theme</th>
                        <th className="pb-2 pr-3">Lane</th>
                        <th className="pb-2 pr-3">Verdict</th>
                        <th className="pb-2 pr-3">Action</th>
                        <th className="pb-2 pr-3">Sizing</th>
                        <th className="pb-2 pr-3">Price</th>
                        <th className="pb-2">Bear Concern</th>
                      </tr>
                    </thead>
                    <tbody>
                      {run.debates.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-border/50 hover:bg-accent/30 cursor-pointer"
                          onClick={() => navigate(`/debates/${d.id}`)}
                        >
                          <td className="py-2 pr-3 font-medium">{d.ticker}</td>
                          <td className="py-2 pr-3 text-muted-foreground text-xs">{d.themeKey}</td>
                          <td className="py-2 pr-3">
                            {d.lane && <Badge className={`text-xs ${LANE_COLORS[d.lane] ?? ''}`}>{d.lane}</Badge>}
                          </td>
                          <td className="py-2 pr-3">
                            <Badge className={`text-xs ${VERDICT_COLORS[d.finalVerdict] ?? ''}`}>
                              {d.finalVerdict}
                            </Badge>
                          </td>
                          <td className="py-2 pr-3">
                            {d.screenerAction && (
                              <Badge className={`text-xs ${ACTION_COLORS[d.screenerAction] ?? ''}`}>
                                {d.screenerAction}
                              </Badge>
                            )}
                            {d.rejectionReason && (
                              <span className="text-xs text-red-400 ml-1">{d.rejectionReason}</span>
                            )}
                          </td>
                          <td className="py-2 pr-3 text-xs text-muted-foreground">{d.sizingChosen ?? '-'}</td>
                          <td className="py-2 pr-3 text-xs">{d.priceAtDebate ? `$${d.priceAtDebate.toFixed(2)}` : '-'}</td>
                          <td className="py-2 text-xs text-muted-foreground line-clamp-1">{d.bearPrimaryConcern ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Stock Suggestions */}
          {run.suggestions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Stock Suggestions ({run.suggestions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {run.suggestions.map((s) => (
                    <div key={s.id} className="rounded-md border border-border p-3 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.ticker}</span>
                        <Badge className={`text-xs ${ACTION_COLORS[s.action] ?? ''}`}>{s.action}</Badge>
                        {s.lane && <Badge className={`text-xs ${LANE_COLORS[s.lane] ?? ''}`}>{s.lane}</Badge>}
                        {s.confidence && <Badge className={`text-xs ${CONVICTION_COLORS[s.confidence] ?? ''}`}>{s.confidence}</Badge>}
                        {s.strategyType && <Badge variant="outline" className="text-xs">{s.strategyType}</Badge>}
                      </div>
                      {s.thesis && <p className="text-xs text-muted-foreground">{s.thesis}</p>}
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        {s.priceAtAction && <span>Price: ${s.priceAtAction.toFixed(2)}</span>}
                        {s.sizing && <span>Size: {s.sizing}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trades Executed */}
          {run.trades.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Trades Executed ({run.trades.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-3">Ticker</th>
                      <th className="pb-2 pr-3">Type</th>
                      <th className="pb-2 pr-3">Qty</th>
                      <th className="pb-2 pr-3">Fill</th>
                      <th className="pb-2 pr-3">Value (GBP)</th>
                      <th className="pb-2 pr-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {run.trades.map((t) => (
                      <tr key={t.id} className="border-b border-border/50">
                        <td className="py-2 pr-3 font-medium">{t.ticker}</td>
                        <td className="py-2 pr-3">
                          <Badge className={`text-xs ${t.tradeType === 'BUY' ? 'bg-green-800/30 text-green-400' : 'bg-red-800/30 text-red-400'}`}>
                            {t.tradeType}
                          </Badge>
                        </td>
                        <td className="py-2 pr-3 text-xs">{t.quantity?.toFixed(4) ?? '-'}</td>
                        <td className="py-2 pr-3 text-xs">{t.fillPrice ? `$${t.fillPrice.toFixed(2)}` : '-'}</td>
                        <td className="py-2 pr-3 text-xs">{t.valueGbp ? `£${t.valueGbp.toFixed(2)}` : '-'}</td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground">{t.t212Status ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* No data state */}
          {!run.log && !run.insight && run.debates.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No data found for {selectedDate}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Select a date to explore a daily run
          </CardContent>
        </Card>
      )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
