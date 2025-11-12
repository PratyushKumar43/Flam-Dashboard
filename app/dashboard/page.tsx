import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { generateMultiSeriesData } from "@/lib/dataGenerator"

// Server Component - generates initial data on server
export default async function Page() {
  // Generate initial dataset on server (as per assignment pattern)
  const initialData = generateMultiSeriesData(100, Date.now() - 3600000)
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <DashboardContent initialData={initialData} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
