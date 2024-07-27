import { ReactNode } from "react";
import "./Button.style.css";
type Props = {
    variant?: "primary" | "secondary" | "tertiary" | "alert";
    size?: "sm" | "md" | "lg" | "xl";
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
    className?: string;
    type?: "submit" | "reset" | "button";
    tooltip?: string;
};
declare const Button: ({ variant, size, onClick, children, className, tooltip, type, }: Props) => import("react/jsx-runtime").JSX.Element;
export default Button;
