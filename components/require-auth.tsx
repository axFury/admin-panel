"use client"

import { ReactNode, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from 'lucide-react'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
      if (!u) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      }
    })
    return () => unsub()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-content-center text-zinc-400">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" />
          <span>Chargement…</span>
        </div>
      </div>
    )
  }

  if (!user) return null
  return <>{children}</>
}
