import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Panel = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    <div className="custom-panel">
      <motion.div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};
