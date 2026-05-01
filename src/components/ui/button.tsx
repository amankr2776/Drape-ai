'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1) ring-offset-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-35 active:scale-[0.97] active:translate-y-0 overflow-hidden cursor-pointer appearance-none",
  {
    variants: {
      variant: {
        primary: "bg-gold text-obsidian font-semibold tracking-[0.06em] hover:bg-gold-light hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(201,168,76,0.3)]",
        secondary: "border border-[rgba(201,168,76,0.4)] text-gold bg-transparent tracking-[0.06em] hover:border-gold hover:bg-[rgba(201,168,76,0.06)] hover:translate-y-[-1px]",
        ghost: "text-ivory-2 border-none bg-transparent hover:text-gold p-0",
        danger: "bg-rose text-ivory hover:bg-rose-dim",
        icon: "w-10 h-10 p-0 border border-[rgba(201,168,76,0.15)] bg-transparent hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.06)]",
        outline: "border border-border bg-transparent hover:border-gold/30 hover:bg-gold/5",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-8",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), loading && "relative !text-transparent min-w-[120px]")}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-current">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
          </div>
        )}
        <span className={cn("relative z-10 flex items-center gap-2", loading && "opacity-0")}>
          {children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }