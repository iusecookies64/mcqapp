import { ReactElement, ReactNode } from "react";
import "./Modal.style.css";
type Props = {
    children: ReactNode | ((onClose: () => void) => ReactElement);
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export declare const Modal: ({ children, isOpen, setIsOpen }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
