import { useState } from 'react'
import { useReflections } from '@/api/reflections'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'

export function ReflectionsPage() {
  const { data: reflections, isLoading } = useReflections()
  const [expanded, setExpanded] = useState<string | undefined>()

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Weekly Reflections</h2>

      {reflections && reflections.length > 0 ? (
        <div className="space-y-4">
          {reflections.map((r) => (
            <Card key={r.weekLabel}>
              <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(expanded === r.weekLabel ? undefined : r.weekLabel)}>
                <CardTitle className="text-sm flex items-center gap-3">
                  <span>{r.weekLabel}</span>
                  <Badge variant="outline" className="text-xs">
                    {r.closedPositionsCount} closed
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.periodStart).toISOString().split('T')[0]} - {new Date(r.periodEnd).toISOString().split('T')[0]}
                  </span>
                </CardTitle>
              </CardHeader>

              {expanded === r.weekLabel && (
                <CardContent className="space-y-4">
                  {/* Confidence calibration */}
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">Confidence Calibration</h4>
                    <div className="flex gap-4">
                      {Object.entries(r.confidenceCalibration).map(([level, data]: [string, any]) => (
                        <div key={level} className="rounded-md border border-border p-3 text-center min-w-[100px]">
                          <p className="text-xs font-medium">{level}</p>
                          <p className="text-lg font-semibold mt-1">
                            {data.count > 0 ? (
                              <span className={data.avg_return_pct >= 0 ? 'text-green-400' : 'text-red-400'}>
                                {data.avg_return_pct >= 0 ? '+' : ''}{data.avg_return_pct.toFixed(1)}%
                              </span>
                            ) : '-'}
                          </p>
                          <p className="text-xs text-muted-foreground">{data.count} positions</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System lessons */}
                  {r.systemLessons.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-2">System Lessons</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {r.systemLessons.map((l, i) => (
                          <li key={i}>- {l}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Position reviews */}
                  {r.positionReviews.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="reviews">
                        <AccordionTrigger className="text-xs">Position Reviews ({r.positionReviews.length})</AccordionTrigger>
                        <AccordionContent>
                          <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                            {JSON.stringify(r.positionReviews, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {/* Theme lessons */}
                  {r.themeLessons.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="themes">
                        <AccordionTrigger className="text-xs">Theme Lessons ({r.themeLessons.length})</AccordionTrigger>
                        <AccordionContent>
                          <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                            {JSON.stringify(r.themeLessons, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {/* Risk calibration */}
                  {r.riskCalibration && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="risk">
                        <AccordionTrigger className="text-xs">Risk Calibration</AccordionTrigger>
                        <AccordionContent>
                          <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
                            {JSON.stringify(r.riskCalibration, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                  {r.nextWeekWatch && (
                    <div>
                      <h4 className="text-xs font-medium text-muted-foreground mb-1">Next Week Watch</h4>
                      <p className="text-sm text-muted-foreground">{r.nextWeekWatch}</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No reflections yet
          </CardContent>
        </Card>
      )}
    </div>
  )
}
