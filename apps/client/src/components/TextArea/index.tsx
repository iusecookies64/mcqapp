import { useEffect, useRef, useState } from "react";
import "./textarea.style.css";
import { FieldError } from "react-hook-form";

interface Props {
  inputLabel?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  value?: string;
  error?: FieldError;
  errorMessage?: string;
  className?: string;
}

export const Textarea = ({
  inputLabel,
  error,
  errorMessage,
  onChange,
  className = "",
  placeholder = "",
  value = "",
}: Props) => {
  const [isFocussed, setFocussed] = useState(false);
  const dynamicHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const initializeHeight = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };
  const elementRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (elementRef && elementRef.current) {
      setTimeout(() => {
        if (elementRef.current) {
          initializeHeight(elementRef.current);
        }
      });
    }
  }, [elementRef]);

  return (
    <div className="custom-textarea-container">
      {inputLabel && (
        <label className="text-sm text-text-secondary dark:text-dark-text-secondary">
          {inputLabel}
        </label>
      )}
      <div className={`custom-textarea ${isFocussed ? "focussed" : ""}`}>
        <textarea
          value={value}
          className={className}
          placeholder={placeholder}
          onChange={(e) => {
            if (onChange) onChange(e);
            dynamicHeight(e);
          }}
          onFocus={() => setFocussed(true)}
          onBlur={() => setFocussed(false)}
          rows={1}
          ref={elementRef}
        />
      </div>
      {error && <span className="text-sm text-red-500">{errorMessage}</span>}
    </div>
  );
};
