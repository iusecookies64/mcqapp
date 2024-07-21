import { motion } from "framer-motion";
import "./Tabs.style.css";
import { useEffect, useState } from "react";

type Props = {
  tabs: { title: string; value: string }[];
  activeTab: string;
  setActiveTab: (value: string) => void;
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
  }, [activeTab]);

  return (
    <div id="ui-tabs" className="tabs-container">
      <div className="absolute top-0 left-0 w-full h-full z-[0]">
        <motion.div
          animate={animationState}
          transition={{ ease: "easeOut", duration: 0.2 }}
          className="bg-primary dark:bg-purple rounded z-[0]"
        />
      </div>
      <div className="tabs">
        {tabs.map((tab, indx) => (
          <div
            className={activeTab === tab.value ? "active-tab" : ""}
            id={tab.value}
            key={indx}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.title}
          </div>
        ))}
      </div>
    </div>
  );
};
