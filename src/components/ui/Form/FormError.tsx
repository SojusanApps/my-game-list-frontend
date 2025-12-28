import React from "react";
import { cn } from "@/utils/cn";

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormError({ message, className, ...props }: FormErrorProps) {
  if (!message) return null;
  return (
    <p
      className={cn(
        "text-error-600 text-xs font-medium mt-1 animate-in fade-in slide-in-from-top-1 duration-200",
        className,
      )}
      {...props}
    >
      {message}.
    </p>
  );
}
