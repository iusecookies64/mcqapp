import { useState } from "react";
import "./Contests.style.css";
import { Tabs } from "../../components/tabs/Tabs";

export const Contests = () => {
  const tabs = ["Upcoming Contests", "Participated Contests", "My Contests"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <div className="contest-list-container">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
