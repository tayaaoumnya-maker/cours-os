import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "destructive" | "outline"
  size?: "sm" | "md" | "icon"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-accent text-white hover:bg-accent-hover": variant === "default",
            "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated": variant === "ghost",
            "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20": variant === "destructive",
            "bg-transparent border border-bg-border text-text-secondary hover:text-text-primary hover:border-text-muted": variant === "outline",
          },
          {
            "h-7 px-2.5 text-xs gap-1.5": size === "sm",
            "h-9 px-4 text-sm gap-2": size === "md",
            "h-8 w-8 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
