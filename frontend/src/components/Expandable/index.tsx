import { motion } from "framer-motion";
import { Button } from "../Button";
import { Icon, IconList } from "../Icon";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export const Expandable = ({ children }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="relative pb-4">
      <motion.div
        className="overflow-hidden h-0"
        animate={isExpanded ? { height: "auto" } : { height: "0" }}
      >
        {children}
      </motion.div>
      <Button
        className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 z-1"
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
      >
        <Icon icon={isExpanded ? IconList.chevronup : IconList.chevrondown} />
      </Button>
    </div>
  );
};
