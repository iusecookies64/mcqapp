import "./input.style.css";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  inputLabel: string;
  inputType: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  errorMessage?: string;
  className?: string;
  defaultValue?: string;
}

export const Input = ({
  inputLabel,
  register,
  error,
  errorMessage,
  inputType,
  className = "",
  placeholder = "",
  defaultValue,
}: Props) => {
  return (
    <div className="custom-input">
      <label>{inputLabel}</label>
      <input
        defaultValue={defaultValue || ""}
        className={className}
        {...register}
        type={inputType}
        placeholder={placeholder}
      />
      {error && <span className="text-sm text-red-500">{errorMessage}</span>}
    </div>
  );
};
