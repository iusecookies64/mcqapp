import { ReactElement, ReactNode, useState } from "react";
import "./Modal.style.css";
import { Icon, IconList } from "../Icon/Icon";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode | ((onClose: () => void) => ReactElement);
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Modal = ({ children, isOpen, setIsOpen }: Props) => {
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
              <div className="absolute top-0 right-0 flex justify-end p-2">
                <Icon
                  icon={IconList.xmark}
                  variant="secondary"
                  onClick={onClose}
                />
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
              <div className="absolute top-0 right-0 flex justify-end p-2">
                <Icon
                  icon={IconList.xmark}
                  variant="secondary"
                  onClick={onClose}
                />
              </div>
              {children}
            </motion.div>
          </div>
        )}
      </>
    );
  }
};
