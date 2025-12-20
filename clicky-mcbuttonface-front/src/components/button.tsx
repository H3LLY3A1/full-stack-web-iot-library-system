import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;

  bgColor?: string;
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  bgColor: primaryBgClassName = "bg-black",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70";

  const primaryClass = `text-white ${primaryBgClassName}`;

  const secondaryClass =
    "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 active:bg-neutral-50";

  const variantClass = variant === "primary" ? primaryClass : secondaryClass;

  const sizeClass = size === "sm" ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-xs";

  return (
    <button
      {...props}
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </button>
  );
}
