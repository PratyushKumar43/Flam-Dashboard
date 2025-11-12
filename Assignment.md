# Performance-Critical Data Visualization Dashboard

## 📋 Assignment Overview

Build a high-performance real-time dashboard that can smoothly render and update 10,000+ data points at 60fps using Next.js 14+ with App Router + TypeScript.

## 🎯 Core Requirements

### **Dashboard Features**

- **Multiple Chart Types**: Line chart, bar chart, scatter plot, heatmap
- **Real-time Updates**: New data arrives every 100ms (simulated)
- **Interactive Controls**: Zoom, pan, data filtering, time range selection
- **Data Aggregation**: Group by time periods (1min, 5min, 1hour)
- **Virtual Scrolling**: Handle large datasets in data tables
- **Responsive Design**: Works on desktop, tablet, mobile

### **Performance Targets**

- **60 FPS** during real-time updates
- **< 100ms** response time for interactions
- **Handle 10,000+ points** without UI freezing
- **Memory efficient** - no memory leaks over time

### **Technical Stack**

- **Frontend**: Next.js 14+ App Router + TypeScript
- **Rendering**: Canvas + SVG hybrid approach
- **State Management**: React hooks + Context (no external libraries)
- **Data**: Generate realistic time-series data
- **No chart libraries** (Chart.js, D3) - build from scratch
- **Web Workers** for data processing (bonus)

## 🔧 Technical Challenges (What We're Testing)

### **1. React Performance Optimization**

typescript

`*// Advanced React patterns:*
- useMemo/useCallback optimization
- React.memo for expensive components
- Custom hooks for data management
- useTransition for non-blocking updates
- Concurrent rendering features`

### **2. Next.js App Router Features**

typescript

`*// Modern Next.js patterns:*
- Server Components for initial data
- Client Components for interactivity
- Streaming for progressive loading
- Route handlers for API endpoints
- Static generation where possible`

### **3. Canvas + React Integration**

typescript

`*// Efficient canvas management:*
- useRef for canvas elements
- useEffect cleanup patterns
- RequestAnimationFrame optimization
- Canvas context sharing strategies
```

## 📁 Submission Structure

### **Required Files**
```
performance-dashboard/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard page
│   │   └── layout.tsx
│   ├── api/
│   │   └── data/
│   │       └── route.ts          # Data API endpoints
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── ScatterPlot.tsx
│   │   └── Heatmap.tsx
│   ├── controls/
│   │   ├── FilterPanel.tsx
│   │   └── TimeRangeSelector.tsx
│   ├── ui/
│   │   ├── DataTable.tsx
│   │   └── PerformanceMonitor.tsx
│   └── providers/
│       └── DataProvider.tsx
├── hooks/
│   ├── useDataStream.ts
│   ├── useChartRenderer.ts
│   ├── usePerformanceMonitor.ts
│   └── useVirtualization.ts
├── lib/
│   ├── dataGenerator.ts
│   ├── performanceUtils.ts
│   ├── canvasUtils.ts
│   └── types.ts
├── public/
├── package.json
├── next.config.js
├── tsconfig.json
├── README.md
└── PERFORMANCE.md              # Required!`

### **Documentation Requirements**

### **README.md Must Include:**

- Setup instructions (`npm install && npm run dev`)
- Performance testing instructions
- Browser compatibility notes
- Feature overview with screenshots
- Next.js specific optimizations used

### **PERFORMANCE.md Must Include:**

- **Benchmarking Results**: FPS measurements, memory usage
- **React Optimization Techniques**: Memoization, concurrent features
- **Next.js Performance Features**: SSR/SSG strategies, bundling
- **Canvas Integration**: How you handled React + Canvas efficiently
- **Scaling Strategy**: Server vs client rendering decisions

## 🎯 Evaluation Criteria (Weighted)

### **Performance (35%)**

- Maintains 60fps with 10k+ data points
- Smooth real-time updates
- Memory usage stays stable over time
- Quick response to user interactions

### **Next.js & React Mastery (30%)**

- Proper App Router usage
- Server/Client component decisions
- React performance optimization
- TypeScript integration quality

### **Rendering Quality (20%)**

- Clean, accurate visualizations
- Responsive design implementation
- Smooth animations and transitions
- Professional UI/UX

### **Code Quality (15%)**

- Clean, maintainable TypeScript
- Proper separation of concerns
- Performance monitoring implementation
- Error handling and loading states

## 🚫 What We DON'T Want to See

- **Using D3.js or Chart.js** - build rendering from scratch
- **Blocking the main thread** - leverage React's concurrent features
- **Memory leaks** - dashboard should run for hours
- **Pages Router** - use App Router exclusively
- **Poor React patterns** - avoid unnecessary re-renders

## ⏰ Timeline & Submission

### **Time Limit**: 5 days maximum

### **Submission Method**:

- GitHub repository with clear commit history
- Deployed demo (Vercel recommended for Next.js)
- Performance metrics report

### **Demo Requirements**:

- Include FPS counter in the UI
- Memory usage display
- Data generation controls (increase/decrease load)
- Performance stress test mode
- Works in production build

## 🎪 Bonus Points (Optional)

### **Advanced Next.js Features**

- **Streaming UI** with Suspense boundaries
- **Server Actions** for data mutations
- **Route handlers** with edge runtime
- **Middleware** for request optimization
- **Static generation** for chart configurations

### **Performance Extras**

- **Web Workers** for data processing
- **OffscreenCanvas** for background rendering
- **Service Worker** for data caching
- **Bundle analysis** and optimization
- **Core Web Vitals** optimization

## 🔍 Live Interview Expectations

Be prepared to:

1. **Performance Demo** (5 minutes)
    - Show 10k+ data points running smoothly
    - Demonstrate real-time updates
    - Stress test the dashboard
2. **Next.js Architecture Review** (10 minutes)
    - Explain Server vs Client component choices
    - Discuss App Router implementation
    - Walk through performance optimizations
3. **React Performance Debugging** (10 minutes)
    - We'll simulate a performance issue
    - Use React DevTools Profiler
    - Implement optimization in real-time
4. **Scaling Discussion** (5 minutes)
    - "How would you handle SSR for this dashboard?"
    - "What if this needed to work offline?"
    - "How would you add real-time collaboration?"

## 📊 Sample Implementation Patterns

### **Server Component for Initial Data**

typescript

`*// app/dashboard/page.tsx*
export default async function DashboardPage() {
  const initialData = await generateInitialDataset();
  
  return (
    <DataProvider initialData={initialData}>
      <Dashboard />
    </DataProvider>
  );
}`

### **Client Component for Real-time Updates**

typescript

`*// components/charts/LineChart.tsx*
'use client';

export default function LineChart({ data }: { data: DataPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const renderedData = useMemo(() => 
    processDataForRendering(data), [data]
  );
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const animate = () => {
      renderChart(canvasRef.current!, renderedData);
      requestAnimationFrame(animate);
    };
    
    animate();
  }, [renderedData]);
  
  return <canvas ref={canvasRef} />;
}`

### **Custom Hook for Performance Monitoring**

typescript

`*// hooks/usePerformanceMonitor.ts*
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>();
  
  useEffect(() => {
    const monitor = new PerformanceObserver((list) => {
      *// Track rendering performance*
    });
    
    monitor.observe({ entryTypes: ['measure'] });
    return () => monitor.disconnect();
  }, []);
  
  return metrics;
}`

## 🎯 Performance Benchmarks to Hit

### **Minimum Requirements**

- **10,000 data points**: 60fps steady
- **Real-time updates**: No frame drops
- **Memory growth**: < 1MB per hour
- **Interaction latency**: < 100ms
- **Bundle size**: < 500KB gzipped

### **Stretch Goals**

- **50,000 data points**: 30fps minimum
- **100,000 data points**: Usable (15fps+)
- **Mobile performance**: Smooth on tablets
- **Core Web Vitals**: All green scores

## 🏗️ Architecture Expectations

### **Next.js App Router Usage**

- Server Components for static chart configurations
- Client Components for interactive visualizations
- Route handlers for data APIs
- Proper loading.tsx and error.tsx boundaries

### **React Performance Patterns**

- Memoized expensive calculations
- Virtualized lists for large datasets
- Concurrent rendering for smooth updates
- Proper cleanup in useEffect hooks

---

**Final Note**: This assignment tests your ability to build production-quality, performance-critical applications using modern Next.js and React patterns. We want to see how you leverage Next.js App Router features while maintaining 60fps performance with large datasets. Focus on making it fast and leveraging the framework's strengths.