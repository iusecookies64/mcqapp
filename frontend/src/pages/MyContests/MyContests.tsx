import { useMyContestList } from "../../hooks/useMyContestList";
import { Loader } from "../../components/loader/Loader";
import { DisplayError } from "../../components/display_error/DisplayError";
import { Contest } from "../../types/models";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/Button";
import CreateContest from "./CreateContest";
import { ReactNode } from "react";
import "./Contests.style.css";

export const Contests = () => {
  const {
    myContests,
    isLoadingList,
    errorLoadingList,
    createContest,
    isLoadingCud,
    errorCud,
  } = useMyContestList(true);
  return (
    <div className="contest-list-container">
      <div className={isLoadingCud || errorCud ? "invisible" : undefined}>
        <MyContestTable
          contestList={myContests}
          label={
            <div className="flex w-full justify-between items-center py-4">
              <div className="text-2xl font-medium">Your Contests</div>
              <CreateContest
                createContest={createContest}
                isLoading={isLoadingCud}
                error={errorCud}
              />
            </div>
          }
        />
      </div>
      {isLoadingList && <Loader />}
      {errorLoadingList && (
        <DisplayError errorMessage="Error Loading Contests" />
      )}
    </div>
  );
};

type MyContestTableProps = {
  contestList: Contest[];
  label: ReactNode;
};

export const MyContestTable = ({ contestList, label }: MyContestTableProps) => {
  const navigate = useNavigate();
  return (
    <div>
      {label}
      <div className="contest-table">
        <table>
          <thead>
            <tr>
              <th className="first">Name</th>
              <th>Max Participants</th>
              <th>Duration</th>
              <th className="last">Action</th>
            </tr>
          </thead>
          <tbody>
            {contestList.map((contest) => {
              return (
                <tr key={contest.contest_id} className="contest-data-row">
                  <td className="first">{contest.title}</td>
                  <td>{contest.max_participants}</td>
                  <td>{contest.duration}</td>
                  <td className="last">
                    {!contest.published ? (
                      <Button
                        variant="alert"
                        size="sm"
                        onClick={() => {
                          navigate(
                            `/compile-contest?contest-id=${contest.contest_id}`
                          );
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          navigate(`/lobby?contest-id=${contest.contest_id}`);
                        }}
                      >
                        Enter
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {contestList.length === 0 && (
          <div className="w-full p-4 flex justify-center bg-white dark:bg-primary">
            Your Created Contest Will Appear Here
          </div>
        )}
      </div>
    </div>
  );
};
