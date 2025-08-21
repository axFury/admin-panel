"use server";

import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import nodemailer from "nodemailer";

// Init Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

// Fonction envoi mail
async function sendMail(to: string, link: string) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT === "465",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || "Support <no-reply@example.com>",
        to,
        subject: "Créez votre mot de passe",
        html: `<p>Bonjour, cliquez sur ce lien pour définir votre mot de passe :</p>
           <a href="${link}">${link}</a>`,
    });
}

export type InviteResult = { ok: boolean; message: string; debugLink?: string };

export async function inviteUserAction(
    _prevState: InviteResult | undefined,
    formData: FormData
): Promise<InviteResult> {
    try {
        const email = String(formData.get("email") || "").trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { ok: false, message: "Adresse e-mail invalide." };
        }

        // Crée l’utilisateur si besoin
        try {
            await getAuth().getUserByEmail(email);
        } catch {
            await getAuth().createUser({ email });
        }

        const redirectUrl =
            process.env.APP_PUBLIC_URL?.replace(/\/$/, "") + "/login";

        const link = await getAuth().generatePasswordResetLink(email, {
            url: redirectUrl,
        });

        await sendMail(email, link);

        return {
            ok: true,
            message: `Invitation envoyée à ${email}.`,
            debugLink: process.env.NODE_ENV !== "production" ? link : undefined,
        };
    } catch (err: any) {
        console.error(err);
        return { ok: false, message: err?.message || "Erreur lors de l’envoi." };
    }
}
