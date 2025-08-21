import { NextRequest } from "next/server"
import nodemailer from "nodemailer"

type Body = {
  subject: string
  html: string
  recipients: string[]
}

export async function POST(req: NextRequest) {
  try {
    const { subject, html, recipients } = (await req.json()) as Body
    if (!subject || !html || !Array.isArray(recipients)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400 })
    }
    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10)
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_FROM = process.env.SMTP_FROM

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      return new Response(
        JSON.stringify({
          error:
            "SMTP environment variables missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.",
        }),
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    // Optional: basic recipient sanitation
    const uniqueRecipients = Array.from(new Set(recipients.filter(Boolean))).slice(0, 5000)

    // Chunk into batches to avoid very long headers or provider limits.
    const chunks: string[][] = []
    const batchSize = 90
    for (let i = 0; i < uniqueRecipients.length; i += batchSize) {
      chunks.push(uniqueRecipients.slice(i, i + batchSize))
    }

    let sent = 0
    for (const chunk of chunks) {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: SMTP_FROM, // Primary recipient (sender), real recipients in BCC
        bcc: chunk,
        subject,
        html,
      })
      sent += chunk.length
      // Small delay can help rate limiting on some providers
      await new Promise((r) => setTimeout(r, 200))
    }

    return new Response(JSON.stringify({ ok: true, sent, batches: chunks.length }), { status: 200 })
  } catch (e: any) {
    console.error(e)
    return new Response(JSON.stringify({ error: e?.message || "Internal error" }), { status: 500 })
  }
}

/*
Security note:
For production, protect this endpoint by verifying a Firebase ID token
and authorizing only admin users before sending. Consider Firebase Admin SDK
to verify the token server-side.
*/
