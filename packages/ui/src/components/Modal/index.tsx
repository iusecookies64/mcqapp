import { ReactElement, ReactNode, useState } from "react";
import "./Modal.style.css";
import { Icon, IconList } from "../Icon";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode | ((onClose: () => void) => ReactElement);
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal = ({ children, isOpen, setIsOpen }: Props) => {
  const [opacity, setOpacity] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  const onClose = () => {
    setOpacity(0);
    setScale(1);
    setTimeout(() => {
      setIsOpen(false);
      setOpacity(1);
      setScale(1.1);
    }, 150);
  };

  if (typeof children === "function") {
    return (
      <>
        {isOpen && (
          <div className="custom-modal" onClick={onClose}>
            <motion.div
              animate={{ opacity, scale }}
              transition={{ duration: 0.2 }}
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 right-0 flex justify-end p-2 cursor-pointer"
                onClick={onClose}
              >
                <Icon icon={IconList.xmark} />
              </div>
              {children(onClose)}
            </motion.div>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        {isOpen && (
          <div className="custom-modal" onClick={onClose}>
            <motion.div
              animate={{ opacity, scale }}
              transition={{ duration: 0.2 }}
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute top-0 right-0 flex justify-end p-3 cursor-pointer"
                onClick={onClose}
              >
                <Icon icon={IconList.xmark} />
              </div>
              {children}
            </motion.div>
          </div>
        )}
      </>
    );
  }
};

export default Modal;
