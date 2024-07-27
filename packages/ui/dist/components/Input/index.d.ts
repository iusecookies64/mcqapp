import "./input.style.css";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
interface Props {
    inputLabel?: string;
    inputType: string;
    placeholder?: string;
    register?: UseFormRegisterReturn;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    value?: string;
    error?: FieldError;
    errorMessage?: string;
    className?: string;
    defaultValue?: string;
}
declare const Input: ({ inputLabel, register, error, errorMessage, onChange, inputType, className, placeholder, defaultValue, value, }: Props) => import("react/jsx-runtime").JSX.Element;
export default Input;
