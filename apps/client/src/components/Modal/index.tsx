import { ReactElement, ReactNode } from "react";
import "./Modal.style.css";
import { Icon, IconList } from "../Icon";

type Props = {
  children: ReactNode | ((onClose: () => void) => ReactElement);
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
  isClosable?: boolean;
};

export const Modal = ({
  children,
  isOpen,
  setIsOpen,
  onClose,
  isClosable = true,
}: Props) => {
  const closeModal = () => {
    if (isClosable) {
      setIsOpen(false);
      if (onClose) onClose();
    }
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
                className={`absolute top-0 right-0 flex justify-end p-2 cursor-pointer ${
                  !isClosable && "invisible"
                }`}
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
                className={`absolute top-0 right-0 flex justify-end p-3 cursor-pointer ${
                  !isClosable && "invisible"
                }`}
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
