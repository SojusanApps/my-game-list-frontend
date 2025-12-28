import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md",
        secondary: "bg-secondary-500 text-white shadow-sm hover:bg-secondary-600 hover:shadow-md",
        destructive: "bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow-md",
        outline:
          "border border-background-300 bg-transparent text-text-700 hover:bg-background-100 hover:text-text-900",
        ghost: "text-text-600 hover:bg-background-200 hover:text-text-900",
        link: "text-primary-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "px-6 py-3 text-base",
      },
      fullWidth: {
        true: "w-full",
      },
      uppercase: {
        true: "uppercase tracking-wide",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, uppercase, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, fullWidth, uppercase, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
