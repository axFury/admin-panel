"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Mails, LogOut, Palette, ListChecks } from 'lucide-react'
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"

const navItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Newsletter", href: "/newsletter", icon: Mails },
    { title: "Changelog", href: "/changelog", icon: ListChecks },
]

export function AppSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { toast } = useToast()

    return (
        <Sidebar className="bg-[#1a1a1a] text-zinc-200 border-r border-zinc-800" collapsible="icon">
            <SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-400">
                        <div className="flex items-center gap-2">
                            <img
                                src="ShowTime-logo.png"
                                alt="ShowTime Logo"
                                className="h-6 w-6 object-contain"
                            />
                            <span className="font-semibold">ShowTime</span>
                        </div>
                    </SidebarGroupLabel>
                </SidebarGroup>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-500">Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const Icon = item.icon
                                const active = pathname === item.href
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                                            <Link href={item.href} className="text-sm">
                                                <Icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={async () => {
                                await signOut(auth)
                                toast({
                                    title: "Déconnecté",
                                    description: "Votre session a été fermée.",
                                })
                                router.push("/login")
                            }}
                            tooltip="Se déconnecter"
                            className="text-red-300 hover:text-white hover:bg-red-600/20"
                        >
                            <LogOut />
                            <span>Se déconnecter</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
