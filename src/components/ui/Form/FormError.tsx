import React from "react";
import { cn } from "@/utils/cn";

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormError({ message, className, ...props }: FormErrorProps) {
  if (!message) return null;
  return (
    <p className={cn("text-red-500 text-xs italic mt-1", className)} {...props}>
      {message}.
    </p>
  );
}
