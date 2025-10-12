'use client'

import { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Loader2 } from 'lucide-react'
import { apiRequest } from '@/src/utils/apiClient'

export default function APIFetcher() {
    const [url, setUrl] = useState('')
    const [method, setMethod] = useState<'GET' | 'POST'>('GET')
    const [payload, setPayload] = useState('')
    const [payloadType, setPayloadType] = useState<'json' | 'form'>('json')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url.trim()) return alert('Enter a valid URL')

        try {
            setLoading(true)
            setError(null)
            setResponse(null)

            const parsedPayload =
                payloadType === 'json' && payload.trim()
                    ? JSON.parse(payload)
                    : payload.trim()
                        ? Object.fromEntries(new URLSearchParams(payload))
                        : {}

            const result = await apiRequest({
                method,
                url,
                operation: 'CustomFetch',
                payload: parsedPayload,
                payloadType,
                retry: true,
            })

            if (result.success) {
                setResponse(result.data)
            } else {
                setError(typeof result.error === 'string' ? result.error : result.error?.message || 'Unknown error')
            }
        } catch (err: any) {
            setError(err.message || 'Invalid payload or request failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="max-w-3xl mx-auto shadow-md border border-border">
            <CardHeader>
                <CardTitle>API Fetcher</CardTitle>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>API Endpoint</Label>
                        <Input
                            placeholder="https://api.example.com/data"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label>Method</Label>
                            <select
                                value={method}
                                onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
                                className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                            >
                                <option>GET</option>
                                <option>POST</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <Label>Payload Type</Label>
                            <select
                                value={payloadType}
                                onChange={(e) => setPayloadType(e.target.value as 'json' | 'form')}
                                className="w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                            >
                                <option value="json">JSON</option>
                                <option value="form">Form URL Encoded</option>
                            </select>
                        </div>
                    </div>

                    {method === 'POST' && (
                        <div>
                            <Label>Payload</Label>
                            <textarea
                                placeholder={
                                    payloadType === 'json'
                                        ? '{ "name": "John", "age": 25 }'
                                        : 'name=John&age=25'
                                }
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                className="w-full h-28 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending Request...
                            </>
                        ) : (
                            'Send Request'
                        )}
                    </Button>
                </form>

                {/* Response Viewer */}
                <div className="mt-6">
                    <Label>Response</Label>
                    <div className="p-3 rounded-md border border-muted bg-muted/20 overflow-auto max-h-72">
                        {loading ? (
                            <p className="text-muted-foreground text-sm">Loading...</p>
                        ) : error ? (
                            <pre className="text-sm text-red-500 whitespace-pre-wrap">{error}</pre>
                        ) : response ? (
                            <pre className="text-sm whitespace-pre-wrap">
                                {JSON.stringify(response, null, 2)}
                            </pre>
                        ) : (
                            <p className="text-muted-foreground text-sm">No response yet.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}