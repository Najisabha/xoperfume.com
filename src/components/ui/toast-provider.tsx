"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as Provider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "./use-toast"

export function ToastProvider() {
  const { toasts } = useToast()

  return (
    <Provider>
      {toasts.map(({ id, title, description, variant, action }) => (
        <Toast key={id} variant={variant}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </Provider>
  )
} 