"use client"

import { useEffect, useMemo, useState } from "react"
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Pencil, Trash2, Save, X, Download } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type Changelog = {
    id?: string
    version: string
    date: string
    type: "major" | "minor" | "patch" | string
    downloadUrl: string
    features: string[]
    improvements: string[]
    bugfixes: string[]
}

const emptyItem: Changelog = {
    version: "",
    date: "",
    type: "minor",
    downloadUrl: "",
    features: [""],
    improvements: [""],
    bugfixes: [""],
}

// Fonction pour formater la date en "29 Juin 2025"
function formatDate(date: Date) {
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ]
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export default function ChangelogPage() {
    const [items, setItems] = useState<Changelog[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<Changelog | null>(null)
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    const load = async () => {
        try {
            setLoading(true)
            const snap = await getDocs(collection(db, "changelog"))
            const rows: Changelog[] = []
            snap.forEach((d) => {
                const data = d.data() as any
                rows.push({
                    id: d.id,
                    version: data.version ?? "",
                    date: data.date ?? "",
                    type: data.type ?? "minor",
                    downloadUrl: data.downloadUrl ?? "",
                    features: Array.isArray(data.features) ? data.features : [],
                    improvements: Array.isArray(data.improvements) ? data.improvements : [],
                    bugfixes: Array.isArray(data.bugfixes) ? data.bugfixes : [],
                })
            })
            rows.sort((a, b) => (b.version || "").localeCompare(a.version || "", "fr"))
            setItems(rows)
        } catch (e) {
            console.error(e)
            toast({
                title: "Erreur",
                description: "Impossible de charger les changelogs.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

    const startAdd = () => {
        setEditing({
            ...emptyItem,
            date: formatDate(new Date()),
        })
        setOpen(true)
    }

    const startEdit = (item: Changelog) => {
        setEditing({ ...item })
        setOpen(true)
    }

    const onDelete = async (id?: string) => {
        if (!id) return
        if (!confirm("Supprimer ce changelog ?")) return
        try {
            await deleteDoc(doc(db, "changelog", id))
            toast({ title: "Supprimé", description: "Le changelog a été supprimé." })
            load()
        } catch (e) {
            console.error(e)
            toast({
                title: "Erreur",
                description: "La suppression a échoué.",
                variant: "destructive",
            })
        }
    }

    const sanitizeList = (arr: string[]) =>
        (arr || []).map((s) => s.trim()).filter(Boolean)

    const onSave = async () => {
        if (!editing) return
        const payload: Changelog = {
            version: editing.version.trim(),
            date: editing.date.trim(),
            type: (editing.type || "minor").trim(),
            downloadUrl: editing.downloadUrl.trim(),
            features: sanitizeList(editing.features),
            improvements: sanitizeList(editing.improvements),
            bugfixes: sanitizeList(editing.bugfixes),
        }
        if (!payload.version) {
            toast({ title: "Version requise", variant: "destructive" })
            return
        }
        try {
            setSaving(true)
            if (editing.id) {
                await updateDoc(doc(db, "changelog", editing.id), payload as any)
                toast({ title: "Modifié", description: "Le changelog a été mis à jour." })
            } else {
                await addDoc(collection(db, "changelog"), payload as any)
                toast({ title: "Ajouté", description: "Nouveau changelog créé." })
            }
            setOpen(false)
            setEditing(null)
            load()
        } catch (e) {
            console.error(e)
            toast({
                title: "Erreur",
                description: "Échec de l’enregistrement. Vérifiez vos droits Firestore.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const typeStyle = (t: string) =>
        t === "major"
            ? "bg-fuchsia-600/20 text-fuchsia-300 border-fuchsia-700/40"
            : t === "minor"
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-700/40"
                : "bg-amber-600/20 text-amber-300 border-amber-700/40"

    return (
        <div className="grid gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">Changelog</h1>
                <Button onClick={startAdd} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter
                </Button>
            </div>

            <Card className="border-zinc-800 bg-[#0f131b]">
                <CardHeader>
                    <CardTitle className="text-zinc-200">
                        Tous les changelogs
                        <span className="text-xs font-normal text-zinc-500 ml-2">
              {loading ? "Chargement…" : `${items.length} entrées`}
            </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {loading ? (
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Loader2 className="animate-spin" />
                            Chargement…
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-zinc-400">Aucun changelog pour le moment.</div>
                    ) : (
                        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {items.map((it) => (
                                <li
                                    key={it.id}
                                    className={cn(
                                        "rounded-lg border p-4 transition-colors hover:border-fuchsia-700/40",
                                        "border-zinc-800 bg-[#0b0f15]"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-zinc-100">
                          v{it.version}
                        </span>
                                                <Badge
                                                    variant="outline"
                                                    className={cn("border", typeStyle(it.type))}
                                                    title={it.type}
                                                >
                                                    {it.type}
                                                </Badge>
                                            </div>
                                            <div className="text-xs text-zinc-500 mt-1">{it.date}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 border-zinc-800 text-zinc-300 hover:text-white bg-transparent hover:bg-fuchsia-600/20"
                                                onClick={() => startEdit(it)}
                                                aria-label="Modifier"
                                                title="Modifier"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="h-8 w-8 border-zinc-800 text-red-600 hover:text-red-500 bg-transparent hover:bg-red-600/20"
                                                onClick={() => onDelete(it.id)}
                                                aria-label="Supprimer"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            {it.downloadUrl && (
                                                <a
                                                    href={it.downloadUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-8 w-8 flex items-center justify-center border border-zinc-800 rounded text-zinc-400 hover:text-fuchsia-500 hover:border-fuchsia-500"
                                                    aria-label="Télécharger"
                                                    title="Télécharger"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    {it.features.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="text-sm font-semibold text-emerald-300 mb-1">
                                                Features
                                            </h4>
                                            <ul className="list-disc list-inside text-zinc-300 text-sm">
                                                {it.features.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Improvements */}
                                    {it.improvements.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="text-sm font-semibold text-amber-300 mb-1">
                                                Improvements
                                            </h4>
                                            <ul className="list-disc list-inside text-zinc-300 text-sm">
                                                {it.improvements.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Bugfixes */}
                                    {it.bugfixes.length > 0 && (
                                        <div className="mt-3">
                                            <h4 className="text-sm font-semibold text-fuchsia-300 mb-1">
                                                Bugfixes
                                            </h4>
                                            <ul className="list-disc list-inside text-zinc-300 text-sm">
                                                {it.bugfixes.map((f, i) => (
                                                    <li key={i}>{f}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <EditDialog
                open={open}
                setOpen={setOpen}
                value={editing}
                onChange={setEditing}
                onSave={onSave}
                saving={saving}
            />
        </div>
    )
}

function EditDialog({
                        open,
                        setOpen,
                        value,
                        onChange,
                        onSave,
                        saving,
                    }: {
    open: boolean
    setOpen: (v: boolean) => void
    value: Changelog | null
    onChange: (v: Changelog | null) => void
    onSave: () => Promise<void>
    saving: boolean
}) {
    if (!value) return null

    const changeFeature = (index: number, newVal: string) => {
        const newFeatures = [...value.features]
        newFeatures[index] = newVal
        onChange({ ...value, features: newFeatures })
    }

    const addFeature = () => {
        onChange({ ...value, features: [...value.features, ""] })
    }

    const removeFeature = (index: number) => {
        const newFeatures = [...value.features]
        newFeatures.splice(index, 1)
        onChange({ ...value, features: newFeatures })
    }

    // Même chose pour improvements
    const changeImprovement = (index: number, newVal: string) => {
        const newImprovements = [...value.improvements]
        newImprovements[index] = newVal
        onChange({ ...value, improvements: newImprovements })
    }
    const addImprovement = () => {
        onChange({ ...value, improvements: [...value.improvements, ""] })
    }
    const removeImprovement = (index: number) => {
        const newImprovements = [...value.improvements]
        newImprovements.splice(index, 1)
        onChange({ ...value, improvements: newImprovements })
    }

    // Même chose pour bugfixes
    const changeBugfix = (index: number, newVal: string) => {
        const newBugfixes = [...value.bugfixes]
        newBugfixes[index] = newVal
        onChange({ ...value, bugfixes: newBugfixes })
    }
    const addBugfix = () => {
        onChange({ ...value, bugfixes: [...value.bugfixes, ""] })
    }
    const removeBugfix = (index: number) => {
        const newBugfixes = [...value.bugfixes]
        newBugfixes.splice(index, 1)
        onChange({ ...value, bugfixes: newBugfixes })
    }

    return (
        <Dialog open={open} onOpenChange={(o) => (o ? null : setOpen(false))}>
            <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-auto border-zinc-800 bg-[#0f131b] text-zinc-100 p-6 sm:p-8">
                <DialogHeader>
                    <DialogTitle>Modifier un changelog</DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du changelog ci-dessous.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="version" className="mb-2">Version</Label>
                        <Input
                            id="version"
                            value={value.version}
                            onChange={(e) => onChange({ ...value, version: e.target.value })}
                            placeholder="Exemple: 1.0.0"
                            autoFocus
                        />
                    </div>

                    <div>
                        <Label htmlFor="date" className="mb-2">Date</Label>
                        <Input
                            id="date"
                            value={value.date}
                            onChange={(e) => onChange({ ...value, date: e.target.value })}
                            placeholder="Exemple: 29 Juin 2025"
                        />
                    </div>

                    <div>
                        <Label htmlFor="type" className="mb-2">Type</Label>
                        <select
                            id="type"
                            value={value.type}
                            onChange={(e) => onChange({ ...value, type: e.target.value })}
                            className="bg-[#121921] border border-zinc-700 text-zinc-100 rounded px-2 py-1 w-full"
                        >
                            <option value="major">major</option>
                            <option value="minor">minor</option>
                            <option value="patch">patch</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="downloadUrl" className="mb-2">URL de téléchargement</Label>
                        <Input
                            id="downloadUrl"
                            type="url"
                            value={value.downloadUrl}
                            onChange={(e) => onChange({ ...value, downloadUrl: e.target.value })}
                            placeholder="https://exemple.com/download"
                        />
                    </div>

                    {/* Features */}
                    <div>
                        <Label className="mb-2">Features</Label>
                        {value.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <Input
                                    value={f}
                                    onChange={(e) => changeFeature(i, e.target.value)}
                                    placeholder="Nouvelle feature"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeFeature(i)}
                                    aria-label="Supprimer feature"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button size="sm" onClick={addFeature}>
                            Ajouter une feature
                        </Button>
                    </div>

                    {/* Improvements */}
                    <div>
                        <Label className="mb-2">Improvements</Label>
                        {value.improvements.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <Input
                                    value={f}
                                    onChange={(e) => changeImprovement(i, e.target.value)}
                                    placeholder="Nouvelle amélioration"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeImprovement(i)}
                                    aria-label="Supprimer amélioration"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button size="sm" onClick={addImprovement}>
                            Ajouter une amélioration
                        </Button>
                    </div>

                    {/* Bugfixes */}
                    <div>
                        <Label className="mb-2">Bugfixes</Label>
                        {value.bugfixes.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 mb-2">
                                <Input
                                    value={f}
                                    onChange={(e) => changeBugfix(i, e.target.value)}
                                    placeholder="Nouveau bugfix"
                                />
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => removeBugfix(i)}
                                    aria-label="Supprimer bugfix"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button size="sm" onClick={addBugfix}>
                            Ajouter un bugfix
                        </Button>
                    </div>
                </div>

                <DialogFooter className="mt-6 flex justify-end gap-2">
                    <Button
                        onClick={() => setOpen(false)}
                        variant="outline"
                        disabled={saving}
                        className="bg-transparent text-red-600 hover:text-red-400 hover:bg-red-600/10"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={saving}
                        className="bg-transparent text-violet-600 hover:text-violet-400 hover:bg-violet-600/10"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Sauvegarder
                            </>
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
