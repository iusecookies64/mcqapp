import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import "./Panel.style.css";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Panel = ({ children, isOpen, setIsOpen }: Props) => {
  const [position, setPosition] = useState<"0%" | "-100%">("-100%");
  const onClose = () => {
    setPosition("0%");
    setTimeout(() => {
      setIsOpen(false);
      setPosition("-100%");
    }, 200);
  };
  return (
    <>
      {isOpen && (
        <div className="custom-panel" onClick={onClose}>
          <motion.div
            transition={{ ease: "easeOut", duration: 0.2 }}
            animate={{ x: position }}
            className="panel-container"
          >
            {children}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Panel;
