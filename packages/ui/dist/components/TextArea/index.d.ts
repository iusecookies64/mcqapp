import "./textarea.style.css";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
interface Props {
    inputLabel?: string;
    placeholder?: string;
    register?: UseFormRegisterReturn;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
    value?: string;
    error?: FieldError;
    errorMessage?: string;
    className?: string;
    defaultValue?: string;
}
export declare const Textarea: ({ inputLabel, register, error, errorMessage, onChange, className, placeholder, defaultValue, value, }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
