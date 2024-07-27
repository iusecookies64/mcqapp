import { ReactNode } from "react";
import "./Panel.style.css";
type Props = {
    children: ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
declare const Panel: ({ children, isOpen, setIsOpen }: Props) => import("react/jsx-runtime").JSX.Element;
export default Panel;
