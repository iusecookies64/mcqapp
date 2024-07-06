import { ReactNode } from "react";
import "./Button.style.css";
type Props = {
  variant?: "primary" | "secondary" | "tertiary" | "alert";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button";
};

export const Button = ({
  variant = "primary",
  size = "md",
  onClick,
  children,
  className,
  type,
}: Props) => {
  return (
    <button
      className={`custom-button button-${variant} button-${size} ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
