import * as React from "react"
import { cn } from "@/src/lib/utils"

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-sand", className)}
    {...props}
  />
))
Label.displayName = "Label"