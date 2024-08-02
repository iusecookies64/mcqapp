import { ReactNode } from "react";
import "./Button.style.css";

type Props = {
  variant?: "primary" | "secondary" | "tertiary" | "alert" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button";
  tooltip?: string;
};

const Button = ({
  variant = "primary",
  size = "md",
  onClick,
  children,
  className,
  tooltip = "",
  type,
}: Props) => {
  return (
    <button
      className={`custom-button button-${variant} button-${size} ${className}`}
      onClick={onClick}
      type={type}
      data-tooltip-id="my-tooltip"
      data-tooltip-content={tooltip}
    >
      {children}
    </button>
  );
};

export default Button;
