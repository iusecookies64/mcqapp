import { motion } from "framer-motion";
import "./Tabs.style.css";
import { useEffect, useState } from "react";

type Props = {
  tabs: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export const Tabs = ({ tabs, activeTab, setActiveTab }: Props) => {
  const [animationState, setAnimationBoxState] = useState({
    x: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const parentRect = document
      .getElementById("ui-tabs")
      ?.getBoundingClientRect();
    const rect = document.getElementById(activeTab)?.getBoundingClientRect();
    if (!rect || !parentRect) return;
    const xPos = rect?.x - parentRect?.x;
    const width = rect.width;
    const height = parentRect.height;
    setAnimationBoxState({
      x: xPos,
      width: width,
      height: height,
    });
    console.log(activeTab);
  }, [activeTab]);

  return (
    <div id="ui-tabs" className="tabs-container">
      <div className="absolute top-0 left-0 w-full h-full z-[0]">
        <motion.div
          animate={animationState}
          transition={{ ease: "easeOut", duration: 0.2 }}
          className="bg-black dark:bg-purple rounded-t z-[0]"
        />
      </div>
      <div className="tabs">
        {tabs.map((tab, indx) => (
          <div
            className={activeTab === tab ? "active-tab" : ""}
            id={tab}
            key={indx}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
};
