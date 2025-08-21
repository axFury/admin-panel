"use client"

import { useEffect, useMemo, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Eye } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

type Subscriber = { id: string; email: string }

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState("🎧 Mise à jour Showtime")
  const [html, setHtml] = useState<string>(defaultTemplate)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const snap = await getDocs(collection(db, "newsletter"))
        const rows: Subscriber[] = []
        snap.forEach((doc) => {
          const data = doc.data() as any
          if (data?.email) rows.push({ id: doc.id, email: String(data.email) })
        })
        setSubscribers(rows)
      } catch (e) {
        console.error(e)
        toast({
          title: "Erreur",
          description: "Impossible de charger les abonnés.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  const count = subscribers.length
  const previewSrcDoc = useMemo(() => html, [html])

  const handleSend = async () => {
    try {
      if (!count) {
        toast({ title: "Aucun abonné", description: "La liste est vide." })
        return
      }
      setSending(true)
      const res = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html,
          recipients: subscribers.map((s) => s.email),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to send")
      }
      toast({
        title: "Email envoyé",
        description: `Envoyé à ${data.sent} destinataires en ${data.batches} batch(s).`,
      })
    } catch (e: any) {
      console.error(e)
      toast({
        title: "Erreur d’envoi",
        description:
          e?.message ||
          "Vérifiez la configuration SMTP dans vos variables d’environnement.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">Newsletter</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-zinc-800 bg-[#0f131b]">
          <CardHeader>
            <CardTitle className="text-zinc-200">
              Rédiger l’email
              <span className="ml-2 text-xs text-zinc-500 font-normal">
                {loading ? "Chargement des abonnés…" : `${count} abonné(s)`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="text-sm text-zinc-400">Sujet</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-[#0b0f15] border-zinc-800 text-zinc-100"
              placeholder="Sujet de l’email"
            />
            <label className="text-sm text-zinc-400">Template HTML</label>
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="min-h-[260px] font-mono text-sm bg-[#0b0f15] border-zinc-800 text-zinc-100"
            />
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSend}
                disabled={sending || loading}
                className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer à tous
                  </>
                )}
              </Button>
              <span className="text-xs text-zinc-500">
                Utilise SMTP avec BCC. Configurez SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-[#0f131b]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-200">
              <Eye className="text-fuchsia-500" />
              Aperçu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border border-zinc-800">
              <iframe
                title="Aperçu HTML"
                className="w-full h-[420px] bg-white"
                srcDoc={previewSrcDoc}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zinc-800 bg-[#0f131b]">
        <CardHeader>
          <CardTitle className="text-zinc-200">Aperçu des abonnés</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-zinc-400">Chargement…</div>
          ) : count === 0 ? (
            <div className="text-zinc-400">Aucun abonné trouvé.</div>
          ) : (
            <ul className="text-sm text-zinc-300 grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              {subscribers.slice(0, 30).map((s) => (
                <li key={s.id} className="truncate">{s.email}</li>
              ))}
            </ul>
          )}
          {count > 30 && (
            <div className="mt-2 text-xs text-zinc-500">
              + {count - 30} autres
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const defaultTemplate = `<!doctype html>
<html lang="fr">
<head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Newsletter</title>
  <style>
    .btn { background:#c026d3; color:#fff; padding:12px 18px; border-radius:8px; text-decoration:none; display:inline-block }
    .card { background:#0f131b; color:#e5e7eb; padding:24px; border-radius:12px; border:1px solid #27272a }
  </style>
</head>
<body style="margin:0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; background:#0b0f15; color:#e5e7eb;">
  <div style="max-width:640px;margin:32px auto;padding:0 16px;">
    <div class="card">
      <h1 style="margin:0 0 8px 0;">Bonjour 👋</h1>
      <p style="margin:0 0 16px 0; color:#a1a1aa">
        Ceci est un exemple de template HTML avec les couleurs de votre marque.
      </p>
      <a class="btn" href="https://example.com">Découvrir la mise à jour</a>
      <p style="margin-top:24px; font-size:12px; color:#71717a">
        Vous recevez cet email car vous êtes inscrit à notre newsletter. 
      </p>
    </div>
  </div>
</body>
</html>`
