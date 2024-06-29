import { Contest } from "../../../../types/models";
import { getTimeDetails } from "../../../../utils/getTimeDetails";
import Countdown from "react-countdown";
import { MyContestOptions } from "../contest_options/ContestOptions";
import "./ContestTable.style.css";

type Props = {
  contestList: Contest[];
  isMyContest?: boolean;
};

export const ContestTable = ({ contestList }: Props) => {
  return (
    <div className="contest-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Created By</th>
            <th>Max Participants</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
            <th>Before Contest</th>
          </tr>
        </thead>
        <tbody>
          {contestList.map((contest) => {
            const timeDetails = getTimeDetails(contest.start_time);
            return (
              <tr key={contest.contest_id} className="contest-data-row">
                <td>{contest.title}</td>
                <td>{contest.username}</td>
                <td>{contest.max_participants}</td>
                <td>{contest.duration}</td>
                <td>{timeDetails.start_date}</td>
                <td>{timeDetails.start_time}</td>
                <td>
                  {timeDetails.ended ? (
                    "Ended"
                  ) : (
                    <Countdown date={new Date(contest.start_time)} />
                  )}
                </td>
                <MyContestOptions contestData={contest} />
              </tr>
            );
          })}
        </tbody>
      </table>
      {contestList.length === 0 && (
        <div className="w-full p-4 flex justify-center">
          {" "}
          No Upcoming Contests{" "}
        </div>
      )}
    </div>
  );
};
