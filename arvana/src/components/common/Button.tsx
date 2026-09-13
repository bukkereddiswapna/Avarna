import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "outline" | "outlineLight" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-forest text-ivory hover:bg-forest-light border border-forest",
  secondary: "bg-charcoal text-ivory hover:bg-charcoal-light border border-charcoal",
  outline: "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-ivory",
  // Light-on-dark outline (e.g. buttons sitting on a photo/hero background).
  // Kept as its own variant rather than overriding `outline` via className,
  // since same-specificity Tailwind utilities can fight for priority and
  // leave hover text the same color as the hover background (invisible text).
  outlineLight: "bg-transparent text-ivory border border-ivory hover:bg-ivory hover:text-charcoal",
  ghost: "bg-transparent text-charcoal border border-transparent hover:bg-beige",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs tracking-wide",
  md: "px-6 py-3.5 text-sm tracking-wide",
  lg: "px-8 py-4 text-sm md:text-base tracking-wide",
};

const base =
  "btn-shine inline-flex items-center justify-center gap-2 uppercase font-medium transition-all duration-300 ease-out disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  iconPosition = "right",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...rest}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}

export function LinkButton({
  to,
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  iconPosition = "right",
}: BaseProps & { to: string }) {
  return (
    <Link to={to} className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </Link>
  );
}
