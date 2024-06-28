import { motion } from "framer-motion";
import "./ContestOptions.style.css";
import { Icon, IconList } from "../Icon/Icon";
import { useState } from "react";

export const MyContestOptions = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  return (
    <>
      <div className="contest-options-container">
        <div
          className="h-full flex items-center px-3 cursor-pointer"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="Options"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </div>
        <motion.div
          animate={showOptions ? { x: 10, opacity: 1 } : { x: -10, opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Icon icon={IconList.pen} variant="small" toolTip="Edit Metadata" />
        </motion.div>
        <motion.div
          animate={showOptions ? { x: 20, opacity: 1 } : { x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon
            icon={IconList.plus}
            variant="small"
            toolTip="Add/Edit Questions or Publish"
          />
        </motion.div>
        <motion.div
          animate={showOptions ? { x: 30, opacity: 1 } : { x: -30, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon
            icon={IconList.trash}
            variant="small"
            toolTip="Delete Contest"
          />
        </motion.div>
      </div>
    </>
  );
};
