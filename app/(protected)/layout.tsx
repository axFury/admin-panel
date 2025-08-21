"use client"

import { ReactNode } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import RequireAuth from "@/components/require-auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-[#0a0d12]">
          <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-[#0a0d12]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0a0d12]/60">
            <div className="flex h-14 items-center px-3 md:px-6 gap-3">
              <SidebarTrigger className="text-zinc-400 hover:text-white" />
              <div className="text-zinc-200 font-medium">Admin Panel</div>

            </div>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  )
}
