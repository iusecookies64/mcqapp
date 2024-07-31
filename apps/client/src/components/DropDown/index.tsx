import useOutsideClick from "../../hooks/useOutsideClick";
import Icon, { IconList } from "../Icon";

import "./style.css";

import { useRef, useState } from "react";

type Props<T> = {
  idKey: keyof T;
  labelKey: keyof T;
  value: T | null;
  placeholder: string;
  options: T[];
  onChange: (value: T) => void;
  label?: string;
  className?: string;
  error?: string;
};

const DropDown = <T extends { [key: string]: string | number }>({
  idKey,
  labelKey,
  value,
  onChange,
  options,
  label,
  className,
  placeholder,
  error,
}: Props<T>) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const DropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useOutsideClick(DropdownRef, () => setIsOpen(false)); // closes dropdown on outside click

  return (
    <div
      key={value ? value[idKey] : undefined}
      className={`dropdown-container ${className}`}
      ref={DropdownRef}
    >
      <div className="dropdown-button" onClick={toggleDropdown}>
        {label && (
          <span className="text-text-secondary dark:text-dark-text-secondary">
            {label}:{" "}
          </span>
        )}
        {value ? value[labelKey] : placeholder}
      </div>
      {isOpen && (
        <div onClick={toggleDropdown} className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option[idKey]}
              onClick={() => {
                setIsOpen(false);
                onChange(option);
              }}
              className="dropdown-item"
            >
              {option[labelKey]}
            </div>
          ))}
        </div>
      )}
      <div className={`dropdown-accordion `}>
        <Icon icon={isOpen ? IconList.chevronup : IconList.chevrondown} />
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default DropDown;
