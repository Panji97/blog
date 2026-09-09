import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:opacity-85",
        accent: "bg-accent text-white hover:brightness-110",
        outline: "border border-border bg-transparent hover:bg-surface",
        ghost: "hover:bg-surface",
        subtle: "bg-surface text-foreground hover:bg-border/60",
      },
      size: {
        default: "h-9 px-4 rounded-md",
        sm: "h-8 px-3 rounded-md text-[13px]",
        lg: "h-11 px-6 rounded-md",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
