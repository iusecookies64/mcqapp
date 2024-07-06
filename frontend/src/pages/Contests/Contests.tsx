import { useState } from "react";
import "./Contests.style.css";
import { Tabs } from "../../components/tabs/Tabs";
import { useContestList } from "../../hooks/useContestList";
import { Loader } from "../../components/loader/Loader";
import {
  MyContestTable,
  UpcomingContestTable,
  ParticipatedContestTable,
} from "./components/contest_table/ContestTable";

export const Contests = () => {
  const tabs = ["Upcoming Contests", "Participated Contests", "My Contests"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const {
    upcomingContests,
    participatedContests,
    myContests,
    isLoadingList,
    publishContest,
    joinContest,
  } = useContestList();
  return (
    <div className="contest-list-container">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full flex justify-center py-8">
        {activeTab === tabs[0] && upcomingContests && (
          <UpcomingContestTable
            contestList={upcomingContests.filter(
              (c) =>
                !participatedContests.find(
                  (cc) => cc.contest_id === c.contest_id
                )
            )}
            joinContest={joinContest}
          />
        )}
        {activeTab === tabs[1] && (
          <ParticipatedContestTable contestList={participatedContests} />
        )}
        {activeTab === tabs[2] && (
          <MyContestTable
            contestList={myContests}
            publishContest={publishContest}
          />
        )}
        {isLoadingList && <Loader />}
      </div>
    </div>
  );
};
