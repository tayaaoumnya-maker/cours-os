"use client"

import * as RadixDialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export const Dialog = RadixDialog.Root
export const DialogTrigger = RadixDialog.Trigger
export const DialogClose = RadixDialog.Close

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in" />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-full max-w-lg bg-bg-elevated border border-bg-border rounded-xl shadow-2xl",
          "animate-fade-in p-6",
          className
        )}
      >
        {children}
        <RadixDialog.Close className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors">
          <X size={16} />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-5">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return (
    <RadixDialog.Title className="text-base font-semibold text-text-primary">
      {children}
    </RadixDialog.Title>
  )
}
