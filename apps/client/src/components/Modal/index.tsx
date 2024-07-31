import { ReactElement, ReactNode } from "react";
import "./Modal.style.css";
import { Icon, IconList } from "../Icon";

type Props = {
  children: ReactNode | ((onClose: () => void) => ReactElement);
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
};

export const Modal = ({ children, isOpen, setIsOpen, onClose }: Props) => {
  const closeModal = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (typeof children === "function") {
    return (
      <>
        {isOpen && (
          <div className="custom-modal" onClick={() => closeModal()}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 right-0 flex justify-end p-2 cursor-pointer"
                onClick={() => closeModal()}
              >
                <Icon icon={IconList.xmark} />
              </div>
              {children(closeModal)}
            </div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        {isOpen && (
          <div className="custom-modal" onClick={() => closeModal()}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 right-0 flex justify-end p-3 cursor-pointer"
                onClick={() => closeModal()}
              >
                <Icon icon={IconList.xmark} />
              </div>
              {children}
            </div>
          </div>
        )}
      </>
    );
  }
};
