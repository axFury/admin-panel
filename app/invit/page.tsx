"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRef, useEffect } from "react";
import { inviteUserAction, InviteResult } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="rounded-xl px-4 py-2 border border-zinc-700 text-zinc-100 disabled:opacity-60"
        >
            {pending ? "Envoi..." : "Envoyer l’invitation"}
        </button>
    );
}

export default function InvitePage() {
    const [state, formAction] = useFormState<InviteResult, FormData>(
        inviteUserAction,
        undefined
    );
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state?.ok && inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.focus();
        }
    }, [state?.ok]);

    return (
        <div className="min-h-[60vh] grid place-content-center p-6">
            <div className="max-w-md w-full bg-zinc-900 text-zinc-200 rounded-2xl p-6 border border-zinc-800">
                <h1 className="text-2xl font-semibold">Inviter un utilisateur</h1>
                <form action={formAction} className="mt-5 space-y-4">
                    <input
                        ref={inputRef}
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="utilisateur@exemple.com"
                        className="w-full rounded-xl bg-zinc-950 border border-zinc-700 px-3 py-2 outline-none focus:border-zinc-400"
                    />
                    <SubmitButton />
                    {state && (
                        <div
                            className={`mt-3 text-sm rounded-xl p-3 border ${
                                state.ok
                                    ? "border-emerald-700 text-emerald-300 bg-emerald-950/40"
                                    : "border-red-700 text-red-300 bg-red-950/40"
                            }`}
                        >
                            {state.message}
                            {state.ok && state.debugLink && (
                                <div className="mt-2 text-xs break-all">
                                    (Dev) Lien : <a href={state.debugLink}>{state.debugLink}</a>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
