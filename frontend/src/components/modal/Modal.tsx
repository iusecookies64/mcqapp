import { ReactNode } from "react";
import "./Modal.style.css";
import { Icon, IconList } from "../Icon/Icon";

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
            <div className="flex justify-end pt-4">
              <Icon
                icon={IconList.xmark}
                variant="secondary"
                onClick={() => setIsOpen(false)}
              />
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};
