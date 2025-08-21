"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LockKeyhole } from "lucide-react";

export default function LoginClient({ nextParam }: { nextParam?: string }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) {
                router.replace(nextParam || "/dashboard");
            }
        });
        return () => unsub();
    }, [router, nextParam]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Bienvenue", description: "Connexion réussie." });
            router.replace(nextParam || "/dashboard");
        } catch (err: any) {
            toast({
                title: "Erreur de connexion",
                description: err?.message || "Vérifiez vos identifiants.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100svh] grid place-items-center bg-[#0a0d12] p-4">
            <Card className="w-full max-w-md border-zinc-800 bg-[#0f131b]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-zinc-100">
                        <LockKeyhole className="text-fuchsia-500" />
                        Connexion Admin
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm text-zinc-400">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-[#0b0f15] border-zinc-800 text-zinc-100"
                                placeholder="admin@exemple.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-zinc-400">Mot de passe</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-[#0b0f15] border-zinc-800 text-zinc-100"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
                        >
                            {loading ? "Connexion…" : "Se connecter"}
                        </Button>
                    </form>
                    <p className="mt-4 text-xs text-zinc-500">
                        Utilise Firebase Auth (email/mot de passe).
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
