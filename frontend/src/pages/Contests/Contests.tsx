import { useState } from "react";
import "./Contests.style.css";
import { Tabs } from "../../components/tabs/Tabs";
import { useContestList } from "../../hooks/useContestList";
import { ContestItem } from "../../components/contest-item/ContestItem";

export const Contests = () => {
  const tabs = ["Upcoming Contests", "Participated Contests", "My Contests"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { upcomingContests, participatedContests, myContests, isLoading } =
    useContestList();
  return (
    <div className="contest-list-container">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === tabs[0] && upcomingContests && (
          <div>
            {upcomingContests.map((contest) => (
              <ContestItem details={contest} />
            ))}
          </div>
        )}
        {activeTab === tabs[1] && (
          <div>
            {participatedContests?.map((contest) => (
              <ContestItem details={contest} />
            ))}
          </div>
        )}
        {activeTab === tabs[2] && (
          <div>
            {myContests?.map((contest) => (
              <ContestItem details={contest} />
            ))}
          </div>
        )}
        {isLoading && <div>Loading...</div>}
      </div>
    </div>
  );
};
