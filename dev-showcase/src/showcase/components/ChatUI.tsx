"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@lib/utils"
import { Loader2, Send } from "lucide-react"
import { apiRequest } from "@/src/utils/apiClient"
import { url as baseURL } from "@/src/store/authStore"

interface Message {
    id: number
    role: "user" | "bot"
    content: string
}

export default function ChatUI() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "bot", content: "Hello there 👋 How can I help you today?" },
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)

    const sendMessage = async () => {
        if (!input.trim()) return
        const newMessage: Message = {
            id: Date.now(),
            role: "user",
            content: input.trim(),
        }
        setMessages((msgs) => [...msgs, newMessage])


        try {
            setInput("")
            setLoading(true)

            const parsedPayload = { prompt: newMessage.content }
            const method = 'POST'
            const url = `${baseURL}/api/summary`
            const payloadType = 'json'


            const result = await apiRequest({
                method,
                url,
                operation: 'CustomFetch',
                payload: parsedPayload,
                payloadType,
                retry: true,
            })

            if (result.success) {
                const newMessage: Message = {
                    id: Date.now(),
                    role: "bot",
                    content: result.data.message,
                }
                setMessages((msgs) => [...msgs, newMessage])
            } else {
                setError(typeof result.error === 'string' ? result.error : result.error?.message || 'Unknown error')
            }
        } catch (err: any) {
            setError(err.message || 'Invalid payload or request failed')
        } finally {
            setLoading(false)
        }

        // Fake delay to simulate LLM response
        // setTimeout(() => {
        //   setMessages((msgs) => [
        //     ...msgs,
        //     { id: Date.now(), role: "bot", content: "Interesting... tell me more 🤔" },
        //   ])
        //   setLoading(false)
        // }, 1000)
    }

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, loading])

    return (
        <Card className="w-full h-[calc(88vh-2rem)] mx-auto flex flex-col border border-border bg-background shadow-md">
            {/* Chat Header */}
            <div className="p-4 border-b text-center font-semibold text-lg">
                Chat Assistant
            </div>

            {/* Messages Section */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "px-4 py-2 rounded-2xl text-sm max-w-[75%] shadow-sm",
                                msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="px-4 py-2 rounded-2xl bg-muted text-muted-foreground flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Input Bar */}
            <div className="border-t p-4 bg-background sticky bottom-0 flex gap-2">
                <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                />
                <Button onClick={sendMessage} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
            </div>
        </Card>
    )
}