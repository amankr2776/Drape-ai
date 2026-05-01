
'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-standard ring-offset-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-30 active:scale-[0.97] overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-gold text-obsidian shadow-gold hover:bg-gold-light hover:shadow-lg",
        secondary: "border border-gold text-gold hover:bg-gold/5",
        ghost: "text-ivory hover:bg-gold/10 hover:text-gold",
        danger: "bg-rose text-ivory hover:bg-rose-dim",
        icon: "h-10 w-10 p-0 rounded-full hover:bg-gold/10",
        outline: "border border-border bg-transparent hover:border-gold/30 hover:bg-gold/5",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6",
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
    const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);

    const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    };

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
        className={cn(buttonVariants({ variant, size, className }), loading && "relative !text-transparent")}
        ref={ref}
        disabled={props.disabled || loading}
        onMouseDown={addRipple}
        {...props}
      >
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute pointer-events-none rounded-full bg-gold/20"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
              }}
            />
          ))}
        </AnimatePresence>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-current">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
