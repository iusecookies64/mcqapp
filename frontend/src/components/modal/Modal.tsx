import { ReactNode } from "react";
import "./Modal.style.css";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    <>
      {isOpen && (
        <div className="custom-modal" onClick={() => setIsOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div
              className="flex justify-end pt-2 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              X
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
