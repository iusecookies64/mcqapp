import "./input.style.css";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface Props {
  inputLabel?: string;
  inputType: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  value?: string | number;
  error?: FieldError;
  errorMessage?: string;
  className?: string;
  defaultValue?: string;
}

const Input = ({
  inputLabel,
  register,
  error,
  errorMessage,
  onChange,
  inputType,
  className = "",
  placeholder = "",
  defaultValue,
  value = "",
}: Props) => {
  if (register) {
    return (
      <div className="custom-input">
        {inputLabel && (
          <label className="text-sm text-text-secondary dark:text-dark-text-secondary">
            {inputLabel}
          </label>
        )}
        <input
          aria-label={inputLabel}
          defaultValue={defaultValue || ""}
          className={className}
          {...register}
          type={inputType}
          placeholder={placeholder}
        />
        {error && <span className="text-sm text-red-500">{errorMessage}</span>}
      </div>
    );
  } else {
    return (
      <div className="custom-input">
        {inputLabel && <label>{inputLabel}</label>}
        <input
          value={value}
          className={className}
          type={inputType}
          placeholder={placeholder}
          onChange={onChange}
        />
        {error && <span className="text-sm text-red-500">{errorMessage}</span>}
      </div>
    );
  }
};

export default Input;
