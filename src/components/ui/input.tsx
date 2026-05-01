'use client';

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className="w-full space-y-2 group">
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-input border border-border bg-obsidian-2 px-12 py-12 text-sm text-ivory transition-standard",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              "placeholder:text-ivory-3 focus-visible:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold",
              error && "border-rose",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {label && (
            <label
              className={cn(
                "absolute left-12 transition-standard pointer-events-none text-ivory-3",
                (focused || hasValue) ? "-top-2.5 left-8 px-4 bg-obsidian-2 text-[10px] uppercase tracking-wider font-bold text-gold" : "top-3.5 text-sm"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("text-[10px] uppercase tracking-wider px-4", error ? "text-rose" : "text-ivory-3")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
