import useOutsideClick from "../../hooks/useOutsideClick";
import Icon, { IconList } from "../Icon";

import "./style.css";

import { useRef, useState } from "react";

export type DropdownOption = {
  id: number;
  label: string;
};

type Props = {
  value: DropdownOption;
  options: DropdownOption[];
  onChange: (value: DropdownOption) => void;
  label?: string;
  className?: string;
};

const DropDown = ({ value, onChange, options, label, className }: Props) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const DropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useOutsideClick(DropdownRef, () => setIsOpen(false)); // closes dropdown on outside click

  return (
    <div className={`dropdown-container ${className}`} ref={DropdownRef}>
      <div className="dropdown-button" onClick={toggleDropdown}>
        {label && <span className="font-bold">{label}: </span>}
        {value.label}
      </div>
      {isOpen && (
        <div onClick={toggleDropdown} className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                toggleDropdown();
                onChange(option);
              }}
              className="dropdown-item"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      <div className={`dropdown-accordion `}>
        <Icon icon={isOpen ? IconList.chevronup : IconList.chevrondown} />
      </div>
    </div>
  );
};

export default DropDown;
