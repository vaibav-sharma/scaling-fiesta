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
import { getAllMeals, deleteMeal } from '@/src/utils/mealDB'

type StoredMeal = {
    id: number | string
    data: any
    createdAt?: number
}

export default function MealHistoryTable() {
    const [meals, setMeals] = useState<StoredMeal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})

    // Load meals from IndexedDB
    const loadMeals = async () => {
        try {
            setLoading(true)
            const items = await getAllMeals()
            const sorted = items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            setMeals(sorted)
        } catch (err: any) {
            console.error('Failed to load meals:', err)
            setError('Failed to load saved meals.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMeals()
    }, [])

    // Delete meal
    const handleDelete = async (id: string | number) => {
        try {
            await deleteMeal(id)
            setMeals((prev) => prev.filter((m) => m.id !== id))
            toast.success('Meal deleted successfully.')
        } catch (err) {
            console.error(err)
            toast.error('Failed to delete meal.')
        }
    }

    // Expand row to show details
    const toggleExpand = (id: string | number) => {
        setExpanded((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }))
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Saved Meal History</CardTitle>
            </CardHeader>

            <CardContent>
                {loading && <p className="text-sm text-muted-foreground">Loading meals…</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {!loading && meals.length === 0 && (
                    <p className="text-sm text-muted-foreground">No meals saved yet.</p>
                )}

                {!loading && meals.length > 0 && (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table className="[&_th]:whitespace-normal [&_th]:break-words [&_td]:whitespace-normal [&_td]:break-words">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[25%]">Meal</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Diet</TableHead>
                                        <TableHead>Cuisine</TableHead>
                                        <TableHead>Saved On</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {meals.map((row) => {
                                        const data = row.data || {}
                                        const id = row.id
                                        const mealName = `${data.mains ?? '-'} with ${data.base ?? '-'}`

                                        return (
                                            <React.Fragment key={id}>
                                                <TableRow className="align-top">
                                                    <TableCell className="font-medium break-words max-w-[200px]">{mealName}</TableCell>
                                                    <TableCell className="break-words max-w-[100px]">{data.mealType || '-'}</TableCell>
                                                    <TableCell className="break-words max-w-[100px]">{data.dietType || '-'}</TableCell>
                                                    <TableCell className="break-words max-w-[120px]">{data.cuisine || '-'}</TableCell>
                                                    <TableCell className="text-sm text-muted-foreground break-words max-w-[140px]">
                                                        {row.createdAt
                                                            ? new Date(row.createdAt).toLocaleString()
                                                            : '—'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => toggleExpand(id)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleDelete(id)}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-foreground" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>

                                                {expanded[String(id)] && (
                                                    <TableRow>
                                                        <TableCell colSpan={6}>
                                                            <ExpandedDetails data={data} />
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
                            {meals.map((row) => {
                                const data = row.data || {}
                                const id = row.id
                                const mealName = `${data.mains ?? '-'} with ${data.base ?? '-'}`

                                return (
                                    <div
                                        key={id}
                                        className="border border-border bg-card rounded-lg shadow-sm p-4 space-y-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-base">{mealName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {row.createdAt
                                                        ? new Date(row.createdAt).toLocaleDateString()
                                                        : '—'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => toggleExpand(id)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-foreground" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                            {data.dietType && (
                                                <Badge variant="secondary">{data.dietType}</Badge>
                                            )}
                                            {data.cuisine && (
                                                <Badge variant="outline">{data.cuisine}</Badge>
                                            )}
                                            {data.mealType && (
                                                <Badge variant="default">{data.mealType}</Badge>
                                            )}
                                        </div>

                                        {expanded[String(id)] && (
                                            <div className="pt-2 border-t border-border mt-2">
                                                <ExpandedDetails data={data} />
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
                <Button onClick={loadMeals} variant="outline">Refresh</Button>
            </CardFooter>
        </Card>
    )
}

function ExpandedDetails({ data }: { data: any }) {
    return (
        <div className="p-2 space-y-1 text-sm break-words leading-relaxed">
            <p><strong>Bread/Base:</strong> {data.base}</p>
            <p><strong>Pulses/Proteins:</strong> {data.pulses}</p>
            <p><strong>Main Dish:</strong> {data.mains}</p>
            <p><strong>Sides:</strong> {data.sides}</p>
            <p><strong>Beverage:</strong> {data.beverage}</p>
            {data.instructions && (
                <p className="mt-1"><strong>Instructions:</strong> {data.instructions}</p>
            )}
            {data.reason && (
                <p className="text-muted-foreground mt-1">{data.reason}</p>
            )}
        </div>
    )
}