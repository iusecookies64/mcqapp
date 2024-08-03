import { ReactElement, ReactNode, useRef } from "react";
import "./Modal.style.css";
import { Icon, IconList } from "../Icon";
import { CSSTransition } from "react-transition-group";

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
  const nodeRef = useRef(null);
  const closeModal = () => {
    if (isClosable) {
      setIsOpen(false);
      if (onClose) onClose();
    }
  };

  if (typeof children === "function") {
    return (
      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={300}
        unmountOnExit
        classNames="enter-from-bottom"
      >
        <div className="custom-modal" onClick={() => closeModal()}>
          <div
            ref={nodeRef}
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
      </CSSTransition>
    );
  } else {
    return (
      <CSSTransition
        nodeRef={nodeRef}
        in={isOpen}
        timeout={200}
        unmountOnExit
        classNames="enter-from-bottom"
      >
        <div className="custom-modal" onClick={() => closeModal()}>
          <div
            ref={nodeRef}
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
      </CSSTransition>
    );
  }
};
