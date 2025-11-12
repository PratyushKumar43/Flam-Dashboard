import { IconCpu, IconDatabase, IconGauge, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Live frame rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            60 FPS
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              locked
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Render loop pinned at 16 ms
          </div>
          <div className="text-muted-foreground">
            Canvas + SVG hybrid after worker processing
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Interaction latency</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            84 ms
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconGauge />
              target &lt; 100 ms
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            useTransition keeps inputs responsive
          </div>
          <div className="text-muted-foreground">
            Filters and zooms stay under assignment SLA
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Memory drift</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            0.6 MB/hr
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconDatabase />
              pooled buffers
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Worker recycling prevents leaks
          </div>
          <div className="text-muted-foreground">Matches assignment ceiling of 1 MB/hr</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Worker throughput</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12.2k msgs/s
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCpu />
              4 threads
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Background workers normalize payloads
          </div>
          <div className="text-muted-foreground">Feeds charts without blocking the UI thread</div>
        </CardFooter>
      </Card>
    </div>
  )
}
