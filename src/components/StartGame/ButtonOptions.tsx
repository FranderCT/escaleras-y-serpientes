// src/components/ButtonOptions.tsx
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string; // estilos extra opcionales
} & ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-1";

const byVariant: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:brightness-110 disabled:opacity-60 shadow-lg shadow-indigo-600/20",
  secondary:
    "bg-white/5 text-white border border-white/15 hover:bg-white/10 disabled:opacity-60",
  ghost:
    "text-white/90 hover:bg-white/10 disabled:opacity-60",
};

const bySize: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export default function ButtonOptions({
  children,
  onClick,
  disabled,
  leftIcon,
  rightIcon,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${byVariant[variant]} ${bySize[size]} ${className}`}
      {...rest}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="font-medium">{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
