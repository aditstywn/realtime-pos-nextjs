import AppSidebar from "@/components/common/app-sidebar";
import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import App from "next/app";
import { ReactNode, Suspense } from "react";
import DashboardBreadcrumb from "./_components/dashboard-breadcrumb";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <SidebarInset className="overflow-x-hidden">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width, height] ease-linear group-has-data-[collapsible=icons]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-8"
            />
            <Suspense fallback={null}>
              <DashboardBreadcrumb />
            </Suspense>
          </div>
          <div className="px-4">
            <DarkModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col items-start gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
