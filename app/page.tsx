import Image from "next/image";
import Hero from "@/components/ui/neural-network-hero";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Activity,
  Cpu,
  Gauge,
  MousePointerClick,
  ServerCog,
  Workflow,
} from "lucide-react";

const featureHighlights = [
  {
    title: "Real-time telemetry pipeline",
    description:
      "Stream 10,000+ points every 100ms with prioritised batching, delta compression, and Web Worker preprocessing to keep React concurrent mode unblocked.",
    icon: Activity,
  },
  {
    title: "Hybrid Canvas + SVG rendering",
    description:
      "GPU-accelerated canvas layers for dense plots, paired with SVG overlays for crisp annotations and accessible focus states.",
    icon: Gauge,
  },
  {
    title: "App Router-first architecture",
    description:
      "Server Components hydrate initial dashboards instantly while client islands manage interactions, filters, and performance monitors.",
    icon: Workflow,
  },
  {
    title: "Virtualised insight tables",
    description:
      "Windowed tables, priority queues, and memoised selectors ensure sub-100ms responses when analysts pivot through millions of records.",
    icon: MousePointerClick,
  },
];

const pipelineMilestones = [
  {
    label: "Data ingestion",
    detail: "Edge route handler streams simulated IoT payloads and snapshots baseline metrics for SSR.",
    icon: ServerCog,
  },
  {
    label: "Processing tier",
    detail: "Web Workers normalise payloads, compute rolling aggregates, and push frames to a shared Zustand store.",
    icon: Cpu,
  },
  {
    label: "Visualization",
    detail: "Canvas renderers diff batched frames while SVG overlays drive accessible crosshairs, tooltips, and focus rings.",
    icon: Gauge,
  },
  {
    label: "Performance intelligence",
    detail: "A dedicated monitor tracks FPS, memory pressure, and React render cost with custom hooks for alerting.",
    icon: Activity,
  },
];

const benchmarkMetrics = [
  {
    title: "60 FPS",
    caption: "Sustained frame rate while streaming 10k points per layer across desktop and tablet viewports.",
  },
  {
    title: "<100 ms",
    caption: "Interaction latency for zoom, pan, and filter controls measured with the Performance API.",
  },
  {
    title: "<1 MB / hr",
    caption: "Memory drift ceiling achieved through object pooling and worker-managed buffers.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground" data-page="landing">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Hero
        title="Performance-Critical Data Visualization"
        description="Build a Next.js 14 dashboard that renders 10,000+ real-time data points at 60fps using a Canvas + SVG hybrid pipeline, React concurrent features, and edge-optimised App Router patterns."
        badgeText="Assignment Brief"
        badgeLabel="60 FPS mandate"
        ctaButtons={[
          { text: "Get started", href: "/dashboard", primary: true },
          { text: "View showcase", href: "#showcase" },
        ]}
        microDetails={[
          "Next.js App Router",
          "React concurrent rendering",
          "Web Worker data flow",
        ]}
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-24 md:px-12 lg:px-16">
        <section
          id="get-started"
          className="relative grid gap-10 rounded-3xl bg-muted/30 dark:bg-white/5 p-10 backdrop-blur-xl ring-1 ring-border/60 dark:ring-white/10 shadow-sm lg:grid-cols-[1.1fr_0.9fr] overflow-hidden"
        >
          <div className="flex flex-col gap-6">
            <span className="text-sm font-light uppercase tracking-[0.2em] text-muted-foreground dark:text-white/60">
              Overview
            </span>
            <h2 className="text-4xl font-light leading-tight tracking-tight text-foreground sm:text-5xl">
              Prototype the telemetry hub the assignment demands.
            </h2>
            <p className="text-base font-light leading-relaxed text-muted-foreground dark:text-white/70">
              This landing page translates the requirements from the assignment brief into actionable sections. Start by scaffolding the shadcn-inspired structure under <code className="rounded bg-muted px-2 py-0.5 dark:bg-white/10">/components/ui</code>, wire Tailwind v4 for styling, and keep TypeScript strict to ensure production-ready safety nets.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              {featureHighlights.map((feature) => (
                <article
                  key={feature.title}
                  className="group flex flex-col gap-3 rounded-2xl border border-border/80 dark:border-white/10 bg-muted/40 dark:bg-black/50 p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40 dark:hover:border-white/20 shadow-sm"
                >
                  <feature.icon className="h-6 w-6 text-primary dark:text-cyan-300" />
                  <h3 className="text-lg font-light tracking-tight text-foreground dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border/80 dark:border-white/10 shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=80"
                alt="Engineers monitoring a high-frequency data feed."
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 dark:from-black/70 via-background/10 dark:via-black/10 to-background/0 dark:to-black/0" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-light uppercase tracking-[0.2em] text-foreground/60 dark:text-white/60">
                <span>Simulated IoT Load</span>
                <span>Edge + Client synergy</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4 rounded-3xl border border-border/60 dark:border-white/10 bg-muted/30 dark:bg-white/5 p-8 backdrop-blur-xl shadow-sm">
            <span className="text-sm font-light uppercase tracking-[0.2em] text-muted-foreground dark:text-white/60">
              Benchmarks
            </span>
            <h2 className="text-3xl font-light tracking-tight text-foreground dark:text-white sm:text-4xl">
              Hit the numbers before the live demo starts.
            </h2>
            <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
              Use <code className="rounded bg-muted px-2 py-0.5 dark:bg-white/10">usePerformanceMonitor</code> to track FPS, memory, and React commit cost. Keep the dashboard stable for hours, then log your results in <code className="rounded bg-muted px-2 py-0.5 dark:bg-white/10">PERFORMANCE.md</code>.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {benchmarkMetrics.map((metric) => (
                <div
                  key={metric.title}
                  className="flex flex-col gap-2 rounded-2xl border border-border/80 dark:border-white/10 bg-muted/50 dark:bg-black/60 p-5 text-left shadow-sm"
                >
                  <span className="text-3xl font-light text-primary dark:text-cyan-300">{metric.title}</span>
                  <p className="text-xs font-extralight leading-relaxed text-muted-foreground dark:text-white/60">
                    {metric.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border/80 dark:border-white/10 shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80"
              alt="Developer optimising a data visualisation pipeline."
              width={1600}
              height={1000}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background dark:from-black via-background/40 dark:via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 space-y-3 bg-gradient-to-t from-background/80 dark:from-black/80 via-background/60 dark:via-black/60 to-transparent p-8">
              <h3 className="text-xl font-light tracking-tight text-foreground dark:text-white">
                Stress-test mode
              </h3>
              <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
                Swap datasets, increase worker throughput, and chart bundle size budgets ahead of deployment. Document findings for your README and performance review.
              </p>
            </div>
          </div>
        </section>

        <section
          id="showcase"
          className="relative flex flex-col gap-10 rounded-3xl bg-muted/30 dark:bg-white/5 p-10 backdrop-blur-xl ring-1 ring-border/60 dark:ring-white/10 shadow-sm overflow-hidden"
        >
          <div className="flex flex-col gap-4">
            <span className="text-sm font-light uppercase tracking-[0.2em] text-muted-foreground dark:text-white/60">
              Architecture Runway
            </span>
            <h2 className="text-3xl font-light tracking-tight text-foreground dark:text-white sm:text-4xl">
              How data flows from edge to pixel-perfect charts.
            </h2>
            <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
              The assignment expects clear separation of concerns, concurrent rendering, and proactive performance monitoring. Use this outline to structure providers, hooks, and route handlers before writing datasets.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {pipelineMilestones.map((milestone) => (
              <div
                key={milestone.label}
                className="flex flex-col gap-3 rounded-2xl border border-border/80 dark:border-white/10 bg-muted/50 dark:bg-black/60 p-5 shadow-sm"
              >
                <milestone.icon className="h-6 w-6 text-primary dark:text-purple-300" />
                <h3 className="text-lg font-light tracking-tight text-foreground dark:text-white">
                  {milestone.label}
                </h3>
                <p className="text-xs font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
                  {milestone.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative grid gap-8 rounded-3xl border border-border/60 dark:border-white/10 bg-muted/30 dark:bg-black/70 p-10 shadow-sm overflow-hidden">
          <div className="space-y-4">
            <span className="text-sm font-light uppercase tracking-[0.2em] text-muted-foreground dark:text-white/60">
              Deliverables Checklist
            </span>
            <h2 className="text-3xl font-light tracking-tight text-foreground dark:text-white sm:text-4xl">
              Ship a production-grade dashboard in five days.
            </h2>
            <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
              Document your setup in <code className="rounded bg-muted px-2 py-0.5 dark:bg-white/10">README.md</code>, capture benchmarks in <code className="rounded bg-muted px-2 py-0.5 dark:bg-white/10">PERFORMANCE.md</code>, and deploy to Vercel for a live, stress-tested demo.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-border/80 dark:border-white/10 bg-primary text-primary-foreground dark:bg-white/10 dark:text-black p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/60 dark:text-black/60">
                Day 1–2
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-primary-foreground dark:text-black">
                Scaffold & plan
              </h3>
              <p className="text-sm font-light leading-relaxed text-primary-foreground/70 dark:text-black/70">
                Initialise shadcn structure, harden TypeScript types, and sketch data flow diagrams before touching rendering code.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-border/80 dark:border-white/15 bg-muted/40 dark:bg-white/5 p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-white/60">
                Day 3–4
              </span>
              <h3 className="text-xl font-light tracking-tight text-foreground dark:text-white">
                Optimise the visuals
              </h3>
              <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
                Build charts from scratch, fine-tune requestAnimationFrame loops, and profile React transitions with the DevTools profiler.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-border/80 dark:border-white/15 bg-muted/40 dark:bg-white/5 p-5 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground dark:text-white/60">
                Day 5
              </span>
              <h3 className="text-xl font-light tracking-tight text-foreground dark:text-white">
                Ship & review
              </h3>
              <p className="text-sm font-extralight leading-relaxed text-muted-foreground dark:text-white/70">
                Run stress tests, capture screen recordings, and prepare talking points for the live architecture review.
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-border/80 dark:border-white/10 shadow-sm">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
              alt="Team reviewing dashboard performance metrics."
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-black via-background/60 dark:via-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10 text-foreground dark:text-white">
              <h2 className="text-3xl font-light tracking-tight sm:text-4xl">
                Prepare for the live interview walkthrough.
              </h2>
              <p className="mt-4 max-w-3xl text-sm font-extralight leading-relaxed text-foreground/75 dark:text-white/75">
                Demonstrate the dashboard under stress, justify server vs client boundaries, and explain how you troubleshoot rendering regressions in real time. This hero is just the opening scene—your implementation turns the vision into a production-grade experience.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
