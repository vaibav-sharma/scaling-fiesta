'use client'

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Lightweight IndexedDB helper (no external libs)
 * DB name & store name can be adjusted to match your code.
 */
const DB_NAME = 'MovieRecommenderDB'
const STORE_NAME = 'movies'
const DB_VERSION = 1

type StoredMovie = {
    id: number | string
    data: any // your saved response object
    createdAt?: number
}

/* --- IndexedDB helpers --- */
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION)
        req.onupgradeneeded = () => {
            const db = req.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                store.createIndex('createdAt', 'createdAt', { unique: false })
            }
        }
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })
}

async function getAllMoviesFromDB(): Promise<StoredMovie[]> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.getAll()
        req.onsuccess = () => resolve(req.result as StoredMovie[])
        req.onerror = () => reject(req.error)
    })
}

async function deleteMovieFromDB(id: StoredMovie['id']): Promise<void> {
    const db = await openDB()
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const req = store.delete(id)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
    })
}

/* --- Component --- */
export default function MovieTable() {
    const [movies, setMovies] = useState<StoredMovie[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    const load = async () => {
        setLoading(true)
        setError(null)
        try {
            const items = await getAllMoviesFromDB()
            // sort by createdAt desc if present
            items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            setMovies(items)
        } catch (err: any) {
            console.error('Failed to load movies from IndexedDB', err)
            setError(err?.message || 'Failed to load stored movies.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // load once on mount
        load()
    }, [])

    const handleDelete = async (id: StoredMovie['id']) => {
        try {
            await deleteMovieFromDB(id)
            toast.success('Movie removed from local DB')
            // optimistic update
            setMovies((prev) => prev.filter((m) => m.id !== id))
        } catch (err: any) {
            console.error('Delete failed', err)
            toast.error('Failed to delete movie')
        }
    }

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Saved Movies</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Loading saved movies…</p>
                </CardContent>
            </Card>
        )
    }

    function ExpandedDetails({ data, top }: { data: any; top: any }) {
        return (
            <div className="p-2 space-y-2 text-sm break-words whitespace-normal leading-relaxed">
                <div>
                    <h4 className="font-semibold">Top Pick</h4>
                    <p className="text-primary font-medium">{top.title || '-'}</p>
                    {top.description && (
                        <p className="text-muted-foreground mt-1">{top.description}</p>
                    )}
                </div>

                {Array.isArray(data.alternatives) && data.alternatives.length > 0 && (
                    <div>
                        <h4 className="font-semibold mt-2">Alternatives</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {data.alternatives.map((a: any, i: number) => (
                                <li key={i}>
                                    <strong>{a.title}</strong> — {a.note}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Saved Movies</CardTitle>
            </CardHeader>

            <CardContent>
                {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

                {movies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No saved movies found.</p>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Title</TableHead>
                                        <TableHead>Genre</TableHead>
                                        <TableHead>Language</TableHead>
                                        <TableHead>Picked</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movies.map((row) => {
                                        const data = row.data || {}
                                        const top = data.top_pick || {}
                                        const title = top.title || data.title || 'Untitled'
                                        const genre = data.genre || (Array.isArray(data.genre) ? data.genre.join(', ') : data.genre) || (data.top_pick?.genre ?? '—')
                                        const language = data.language || data.top_pick?.language || '—'

                                        return (
                                            <React.Fragment key={String(row.id)}>
                                                <TableRow>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{title}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                saved {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {genre ? <Badge variant="secondary">{genre}</Badge> : '—'}
                                                    </TableCell>
                                                    <TableCell>{language}</TableCell>
                                                    <TableCell>
                                                        {top.title ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-sm">{top.title}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {top.reason?.slice(0, 80) + (top.reason?.length > 80 ? '…' : '')}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted-foreground">—</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() =>
                                                                    setExpanded((s) => ({
                                                                        ...s,
                                                                        [String(row.id)]: !s[String(row.id)],
                                                                    }))
                                                                }
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDelete(row.id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-foreground" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                                {expanded[String(row.id)] && (
                                                    <TableRow>
                                                        <TableCell colSpan={5}>
                                                            <ExpandedDetails data={data} top={top} />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile cards */}
                        <div className="block md:hidden space-y-4">
                            {movies.map((row) => {
                                const data = row.data || {}
                                const top = data.top_pick || {}
                                const title = top.title || data.title || 'Untitled'
                                const genre = data.genre || (Array.isArray(data.genre) ? data.genre.join(', ') : data.genre) || (data.top_pick?.genre ?? '—')
                                const language = data.language || data.top_pick?.language || '—'

                                return (
                                    <div
                                        key={String(row.id)}
                                        className="border border-border bg-card rounded-lg shadow-sm p-4 space-y-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-base leading-tight">{title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setExpanded((s) => ({
                                                            ...s,
                                                            [String(row.id)]: !s[String(row.id)],
                                                        }))
                                                    }
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(row.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-foreground" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            {genre && <Badge variant="secondary">{genre}</Badge>}
                                            {language !== '—' && <Badge variant="outline">{language}</Badge>}
                                        </div>

                                        {expanded[String(row.id)] && (
                                            <div className="pt-2 border-t border-border mt-2">
                                                <ExpandedDetails data={data} top={top} />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button onClick={load} variant="outline">Refresh</Button>
            </CardFooter>
        </Card>
    )
}