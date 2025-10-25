import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/src/components/ui/spinner"

export function SpinnerBadge({ text }: { text: string }) {  return (
    <div className="flex items-center gap-4 [--radius:1.2rem]">
      <Badge>
        <Spinner className="bg-primary/40"/>
        <p>{text}...</p>
      </Badge>
    </div>
  )
}