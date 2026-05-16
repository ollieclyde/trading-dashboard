import { useState } from 'react'
import { usePositions } from '@/api/positions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LANE_COLORS, CONVICTION_COLORS } from '@/lib/constants'

export function PositionsPage() {
  const [status, setStatus] = useState('OPEN')
  const { data: positions, isLoading } = usePositions({ status })

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Positions</h2>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="OPEN">Open</TabsTrigger>
          <TabsTrigger value="CLOSED">Closed</TabsTrigger>
          <TabsTrigger value="WATCHLIST">Watchlist</TabsTrigger>
        </TabsList>

        <TabsContent value="WATCHLIST" className="mt-4">
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              Watchlist coming soon — track tickers you're considering before opening a position.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={status} className="mt-4">
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : positions && positions.length > 0 ? (
            <Card>
              <CardContent className="pt-4">
                <ScrollArea className="max-h-[calc(100vh-200px)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-3">Ticker</th>
                        <th className="pb-2 pr-3">Theme</th>
                        <th className="pb-2 pr-3">Lane</th>
                        <th className="pb-2 pr-3">Strategy</th>
                        <th className="pb-2 pr-3">Entry</th>
                        <th className="pb-2 pr-3">Current</th>
                        <th className="pb-2 pr-3">P&L</th>
                        <th className="pb-2 pr-3">Size</th>
                        <th className="pb-2 pr-3">Opened</th>
                        {status === 'CLOSED' && <th className="pb-2 pr-3">Closed</th>}
                        <th className="pb-2">Trades</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((p) => {
                        const pnl = status === 'OPEN' ? p.unrealizedPnlPct : p.realizedPnlPct
                        return (
                          <tr key={p.id} className="border-b border-border/50">
                            <td className="py-2 pr-3 font-medium">{p.ticker}</td>
                            <td className="py-2 pr-3 text-xs text-muted-foreground">{p.themeKey}</td>
                            <td className="py-2 pr-3">
                              <Badge className={`text-xs ${LANE_COLORS[p.lane] ?? ''}`}>{p.lane}</Badge>
                            </td>
                            <td className="py-2 pr-3 text-xs text-muted-foreground">{p.strategyType ?? '-'}</td>
                            <td className="py-2 pr-3 text-xs">{p.entryPriceAvg ? `$${p.entryPriceAvg.toFixed(2)}` : '-'}</td>
                            <td className="py-2 pr-3 text-xs">
                              {status === 'OPEN'
                                ? (p.currentPrice ? `$${p.currentPrice.toFixed(2)}` : '-')
                                : (p.exitPrice ? `$${p.exitPrice.toFixed(2)}` : '-')
                              }
                            </td>
                            <td className="py-2 pr-3 text-xs">
                              {pnl != null ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <span className={pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}%
                                  </span>
                                  {pnl >= 10 && (
                                    <Badge className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0">HOT</Badge>
                                  )}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="py-2 pr-3 text-xs">{p.sizeUsd ? `$${p.sizeUsd.toFixed(0)}` : '-'}</td>
                            <td className="py-2 pr-3 text-xs text-muted-foreground">
                              {new Date(p.openedDate).toISOString().split('T')[0]}
                            </td>
                            {status === 'CLOSED' && (
                              <td className="py-2 pr-3 text-xs text-muted-foreground">
                                {p.closedDate ? new Date(p.closedDate).toISOString().split('T')[0] : '-'}
                              </td>
                            )}
                            <td className="py-2 text-xs text-muted-foreground">{p.trades.length}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No {status.toLowerCase()} positions
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
