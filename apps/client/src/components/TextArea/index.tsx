import { useEffect } from "react";
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

export const Textarea = ({
  inputLabel,
  register,
  error,
  errorMessage,
  onChange,
  className = "",
  placeholder = "",
  defaultValue,
  value = "",
}: Props) => {
  const dynamicHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const initializeHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };
  useEffect(() => {
    document.querySelectorAll("textarea").forEach((textarea) => {
      initializeHeight(textarea);
    });
  }, []);
  if (register) {
    return (
      <div className="custom-textarea">
        {inputLabel && <label>{inputLabel}</label>}
        <textarea
          aria-label={inputLabel}
          defaultValue={defaultValue || ""}
          className={className}
          {...register}
          placeholder={placeholder}
          onInput={(e) => dynamicHeight(e)}
          rows={1}
        />
        {error && <span className="text-sm text-red-500">{errorMessage}</span>}
      </div>
    );
  } else {
    return (
      <div className="custom-textarea">
        {inputLabel && <label>{inputLabel}</label>}
        <textarea
          value={value}
          className={className}
          placeholder={placeholder}
          onChange={onChange}
          rows={1}
        />
        {error && <span className="text-sm text-red-500">{errorMessage}</span>}
      </div>
    );
  }
};
