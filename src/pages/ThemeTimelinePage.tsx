import { useParams, useNavigate } from 'react-router-dom'
import { useThemes, useThemeTimeline, useThemeDetail } from '@/api/themes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LANE_COLORS, LIFECYCLE_COLORS, CONVICTION_COLORS, STATUS_COLORS, ACTION_COLORS } from '@/lib/constants'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export function ThemeTimelinePage() {
  const { themeKey } = useParams()
  const navigate = useNavigate()
  const { data: themes, isLoading: themesLoading } = useThemes()
  const { data: timeline, isLoading: timelineLoading } = useThemeTimeline(themeKey)
  const { data: detail, isLoading: detailLoading } = useThemeDetail(themeKey)

  const chartData = timeline?.map((s) => ({
    date: new Date(s.snapshotDate).toISOString().split('T')[0],
    exhaustion: s.exhaustionScore != null ? +(s.exhaustionScore * 100).toFixed(1) : null,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Themes</h2>
        {themesLoading ? (
          <Skeleton className="h-9 w-56" />
        ) : (
          <Select value={themeKey ?? ''} onValueChange={(v) => navigate(`/themes/${v}`)}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {themes?.map((t) => (
                <SelectItem key={t.themeKey} value={t.themeKey}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Theme cards overview */}
      {!themeKey && themes && (
        <div className="grid gap-3 md:grid-cols-2">
          {themes.map((t) => (
            <Card
              key={t.themeKey}
              className="cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => navigate(`/themes/${t.themeKey}`)}
            >
              <CardContent className="pt-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{t.name}</span>
                  <Badge className={`text-xs ${LANE_COLORS[t.lane] ?? ''}`}>{t.lane}</Badge>
                  <Badge className={`text-xs ${LIFECYCLE_COLORS[t.lifecycle] ?? ''}`}>{t.lifecycle}</Badge>
                  {t.conviction && <Badge className={`text-xs ${CONVICTION_COLORS[t.conviction] ?? ''}`}>{t.conviction}</Badge>}
                  {t.status && <span className={`text-xs ${STATUS_COLORS[t.status] ?? ''}`}>{t.status}</span>}
                </div>
                {t.summary && <p className="text-sm text-muted-foreground">{t.summary}</p>}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {t.exhaustionScore != null && (
                    <span>Exhaustion: {(t.exhaustionScore * 100).toFixed(0)}%</span>
                  )}
                  {t.firstIdentified && (
                    <span>Since: {new Date(t.firstIdentified).toISOString().split('T')[0]}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Theme detail view */}
      {themeKey && detailLoading && <Skeleton className="h-64" />}
      {themeKey && detail && (
        <>
          {/* Theme overview card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
                {detail.name}
                <Badge className={`text-xs ${LANE_COLORS[detail.lane] ?? ''}`}>{detail.lane}</Badge>
                <Badge className={`text-xs ${LIFECYCLE_COLORS[detail.lifecycle] ?? ''}`}>{detail.lifecycle}</Badge>
                {detail.conviction && <Badge className={`text-xs ${CONVICTION_COLORS[detail.conviction] ?? ''}`}>{detail.conviction}</Badge>}
                {detail.status && <span className={`text-xs ${STATUS_COLORS[detail.status] ?? ''}`}>{detail.status}</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary / thesis */}
              {detail.summary && (
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Current Summary</span>
                  <p className="mt-1 text-sm text-foreground">{detail.summary}</p>
                </div>
              )}

              {/* Original proposal rationale */}
              {detail.proposals && detail.proposals.length > 0 && detail.proposals[0].rationale && (
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Original Thesis (proposed {new Date(detail.proposals[0].proposedDate).toISOString().split('T')[0]})
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">{detail.proposals[0].rationale}</p>
                </div>
              )}

              {/* Key events */}
              {detail.keyEvents && Array.isArray(detail.keyEvents) && detail.keyEvents.length > 0 && (
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Key Events</span>
                  <div className="mt-1 space-y-1">
                    {(detail.keyEvents as any[]).map((e: any, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className={`text-xs shrink-0 ${
                          e.impact === 'strengthens' ? 'text-green-400' :
                          e.impact === 'weakens' ? 'text-red-400' : 'text-zinc-400'
                        }`}>
                          {e.impact}
                        </Badge>
                        <span>{e.event}</span>
                        {e.expected_date && <span className="text-xs text-muted-foreground ml-auto shrink-0">{e.expected_date}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Meta info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                {detail.exhaustionScore != null && (
                  <div>
                    <span className="text-muted-foreground">Exhaustion</span>
                    <p className="text-foreground font-medium">{(detail.exhaustionScore * 100).toFixed(0)}%</p>
                  </div>
                )}
                {detail.firstIdentified && (
                  <div>
                    <span className="text-muted-foreground">First Identified</span>
                    <p className="text-foreground font-medium">{new Date(detail.firstIdentified).toISOString().split('T')[0]}</p>
                  </div>
                )}
                {detail.searchQueries && detail.searchQueries.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Search Queries</span>
                    <p className="text-foreground">{detail.searchQueries.join(' | ')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Exhaustion Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <Skeleton className="h-64" />
              ) : chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line type="monotone" dataKey="exhaustion" stroke="#f59e0b" strokeWidth={2} dot={false} name="Exhaustion %" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">No snapshot data</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Positions & linked trades */}
            {detail.positions && detail.positions.length > 0 && (
              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Positions & Trades ({detail.positions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {detail.positions.map((p: any) => (
                      <div key={p.id} className="rounded border border-border/50 p-3 space-y-3">
                        {/* Position header */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{p.ticker}</span>
                          <Badge variant="outline" className={`text-xs ${p.status === 'OPEN' ? 'text-green-400' : 'text-zinc-500'}`}>
                            {p.status}
                          </Badge>
                          {p.strategyType && (
                            <Badge variant="outline" className="text-xs text-blue-400">{p.strategyType.replace(/_/g, ' ')}</Badge>
                          )}
                          {p.unrealizedPnlPct != null && (
                            <span className={`text-xs ml-auto ${p.unrealizedPnlPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {p.unrealizedPnlPct >= 0 ? '+' : ''}{p.unrealizedPnlPct.toFixed(2)}%
                            </span>
                          )}
                          {p.realizedPnlPct != null && p.status === 'CLOSED' && (
                            <span className={`text-xs ml-auto ${p.realizedPnlPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {p.realizedPnlPct >= 0 ? '+' : ''}{p.realizedPnlPct.toFixed(2)}%
                            </span>
                          )}
                        </div>

                        {/* Trade logic / thesis from linked suggestion */}
                        {p.linkedSuggestion && (
                          <div className="space-y-1.5 pl-2 border-l-2 border-border/50">
                            {p.linkedSuggestion.thesis && (
                              <div>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Trade Logic</span>
                                <p className="text-xs text-foreground mt-0.5">{p.linkedSuggestion.thesis}</p>
                              </div>
                            )}
                            {p.linkedSuggestion.bullCase && (
                              <div>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-green-500/70">Bull Case</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{p.linkedSuggestion.bullCase}</p>
                              </div>
                            )}
                            {p.linkedSuggestion.bearCase && (
                              <div>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-red-500/70">Bear Case</span>
                                <p className="text-xs text-muted-foreground mt-0.5">{p.linkedSuggestion.bearCase}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Trades table */}
                        {p.trades && p.trades.length > 0 && (
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              Trades ({p.trades.length})
                            </span>
                            <table className="w-full mt-1 text-xs">
                              <thead>
                                <tr className="border-b border-border/50 text-left text-muted-foreground">
                                  <th className="pb-1 pr-2">Type</th>
                                  <th className="pb-1 pr-2">Date</th>
                                  <th className="pb-1 pr-2 text-right">Qty</th>
                                  <th className="pb-1 pr-2 text-right">Price</th>
                                  <th className="pb-1 pr-2 text-right">Value (GBP)</th>
                                  <th className="pb-1">Sizing</th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.trades.map((tr: any) => (
                                  <tr key={tr.id} className="border-b border-border/30">
                                    <td className="py-1 pr-2">
                                      <Badge variant="outline" className={`text-[10px] ${
                                        tr.tradeType === 'BUY' ? 'text-green-400' :
                                        tr.tradeType === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                                      }`}>
                                        {tr.tradeType}
                                      </Badge>
                                    </td>
                                    <td className="py-1 pr-2">{new Date(tr.tradeDate).toISOString().split('T')[0]}</td>
                                    <td className="py-1 pr-2 text-right">{tr.quantity != null ? tr.quantity.toFixed(4) : '-'}</td>
                                    <td className="py-1 pr-2 text-right">{tr.fillPrice != null ? `$${tr.fillPrice.toFixed(2)}` : '-'}</td>
                                    <td className="py-1 pr-2 text-right">{tr.valueGbp != null ? `£${tr.valueGbp.toFixed(2)}` : '-'}</td>
                                    <td className="py-1">{tr.sizingLabel ?? '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent suggestions */}
            {detail.suggestions && detail.suggestions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Recent Decisions ({detail.suggestions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[300px]">
                    <div className="space-y-2">
                      {detail.suggestions.slice(0, 20).map((s: any) => (
                        <div key={s.id} className="rounded border border-border/50 p-2 text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.ticker}</span>
                            <Badge className={`text-xs ${ACTION_COLORS[s.action] ?? ''}`}>{s.action}</Badge>
                            {s.confidence && <Badge className={`text-xs ${CONVICTION_COLORS[s.confidence] ?? ''}`}>{s.confidence}</Badge>}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(s.actionDate).toISOString().split('T')[0]}
                            </span>
                          </div>
                          {s.thesis && <p className="text-xs text-muted-foreground line-clamp-2">{s.thesis}</p>}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Snapshot history */}
          {timeline && timeline.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Daily Snapshots ({timeline.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3">Date</th>
                        <th className="pb-2 pr-3">Lifecycle</th>
                        <th className="pb-2 pr-3">Conviction</th>
                        <th className="pb-2 pr-3">Status</th>
                        <th className="pb-2 pr-3">Exhaustion</th>
                        <th className="pb-2">Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...timeline].reverse().map((s) => (
                        <tr key={s.id} className="border-b border-border/50">
                          <td className="py-1.5 pr-3 text-xs">{new Date(s.snapshotDate).toISOString().split('T')[0]}</td>
                          <td className="py-1.5 pr-3">
                            <Badge className={`text-xs ${LIFECYCLE_COLORS[s.lifecycle] ?? ''}`}>{s.lifecycle}</Badge>
                          </td>
                          <td className="py-1.5 pr-3">
                            {s.conviction && <Badge className={`text-xs ${CONVICTION_COLORS[s.conviction] ?? ''}`}>{s.conviction}</Badge>}
                          </td>
                          <td className="py-1.5 pr-3">
                            {s.status && <span className={`text-xs ${STATUS_COLORS[s.status] ?? ''}`}>{s.status}</span>}
                          </td>
                          <td className="py-1.5 pr-3 text-xs">
                            {s.exhaustionScore != null ? `${(s.exhaustionScore * 100).toFixed(0)}%` : '-'}
                          </td>
                          <td className="py-1.5 text-xs text-muted-foreground max-w-xs truncate">
                            {s.summary ?? '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
