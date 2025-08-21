"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { useToast } from "@/hooks/use-toast"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

type Period = "day" | "week" | "month" | "year" | "all"
type OSFilter = "all" | "Windows" | "Mac" | "Linux"

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [period, setPeriod] = useState<Period>("month")
  const [osFilter, setOsFilter] = useState<OSFilter>("all")
  const [chartData, setChartData] = useState<any>(null)
  const { toast } = useToast()

  const formatDateKey = (date: Date, period: Period) => {
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    const week = Math.ceil(d / 7)
    switch (period) {
      case "day": return date.toISOString().slice(0, 10)
      case "week": return `${y}-W${week}`
      case "month": return `${y}-${m.toString().padStart(2, "0")}`
      case "year": return `${y}`
      case "all": return "Total"
      default: return date.toISOString().slice(0, 10)
    }
  }

  const fetchDownloadsGrouped = async () => {
    setLoading(true)
    try {
      const colRef = collection(db, "download")
      // Créer une requête filtrée si osFilter != all
      let q = colRef
      if (osFilter !== "all") {
        q = query(colRef, where("os", "==", osFilter))
      }

      const snapshot = await getDocs(q)
      const downloads = snapshot.docs.map(doc => {
        const data = doc.data()
        const timestamp = data.timestamp

        if (!timestamp) {
          return new Date(0)
        }
        if (typeof timestamp.toDate === "function") {
          return timestamp.toDate()
        }
        if (typeof timestamp === "string") {
          return new Date(timestamp)
        }
        if (timestamp instanceof Date) {
          return timestamp
        }
        return new Date(0)
      })

      const counts: Record<string, number> = {}
      downloads.forEach(date => {
        const key = formatDateKey(date, period)
        counts[key] = (counts[key] || 0) + 1
      })

      const labels = Object.keys(counts).sort()
      const dataValues = labels.map(label => counts[label])

      setChartData({
        labels,
        datasets: [
          {
            label: "Téléchargements",
            data: dataValues,
            borderColor: "rgba(139, 92, 246, 0.7)",
            backgroundColor: "rgba(139, 92, 246, 0.4)",
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les téléchargements.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDownloadsGrouped()
  }, [period, osFilter]) // relancer à chaque changement de filtre

  return (
      <div className="grid gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
          Tableau de Bord
        </h1>

        <Card className="border-zinc-800 bg-[#0f131b] hover:border-fuchsia-700/40 transition-colors">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Téléchargements ({period})
            </CardTitle>

            <div className="flex gap-2">
              <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as Period)}
                  className="rounded bg-[#1a1a1a] border border-zinc-700 px-2 py-1 text-zinc-200"
              >
                <option value="day">Jour</option>
                <option value="week">Semaine</option>
                <option value="month">Mois</option>
                <option value="year">Année</option>
                <option value="all">Tout</option>
              </select>

              <select
                  value={osFilter}
                  onChange={(e) => setOsFilter(e.target.value as OSFilter)}
                  className="rounded bg-[#1a1a1a] border border-zinc-700 px-2 py-1 text-zinc-200"
              >
                <option value="all">Tous OS</option>
                <option value="Windows">Windows</option>
                <option value="macos-intel">MacOS Intel</option>
                <option value="macos-silicon">MacOS Silicon</option>
                <option value="linux">Linux</option>
              </select>

              <Button
                  size="sm"
                  onClick={fetchDownloadsGrouped}
                  disabled={loading}
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {loading && (
                <p className="text-zinc-400">Chargement des données…</p>
            )}

            {!loading && chartData && (
                <Line
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "top" },
                        title: { display: false },
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                    data={chartData}
                />
            )}
          </CardContent>
        </Card>
      </div>
  )
}
