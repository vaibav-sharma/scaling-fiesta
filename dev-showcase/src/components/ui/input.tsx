import * as React from "react"
import { cn } from "@lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-sand/20 px-3 py-2 text-sm text-softwhite text-foreground placeholder:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          className
        )}
        // className={cn(
        //   "flex h-9 w-full rounded-md border border-sand/20 bg-primary/40 px-3 py-2 text-sm text-softwhite placeholder:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        //   className
        // )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }