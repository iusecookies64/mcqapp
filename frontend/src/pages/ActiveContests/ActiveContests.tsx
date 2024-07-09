import { useNavigate } from "react-router-dom";
import { useAllContests } from "../../hooks/useAllContests";
import "./ActiveContests.style.css";
import { ReactNode, useState } from "react";
import { Contest } from "../../types/models";
import { Button } from "../../components/button/Button";
import { Modal } from "../../components/modal/Modal";
import { Loader } from "../../components/loader/Loader";
import { DisplayError } from "../../components/display_error/DisplayError";

const ActiveContests = () => {
  const { activeContests, isLoading, error } = useAllContests();
  return (
    <div className="contest-list-container">
      <ActiveContestTable
        contestList={activeContests}
        label={
          <div className="flex w-full justify-between items-center py-6">
            <div className="text-2xl font-medium">All Active Contests</div>
          </div>
        }
      />
      {isLoading && <Loader />}
      {error && <DisplayError errorMessage="Error Loading Contests" />}
    </div>
  );
};

type ActiveContestTableProps = {
  contestList: Contest[];
  label: ReactNode;
};

const ActiveContestTable = ({
  contestList,
  label,
}: ActiveContestTableProps) => {
  const navigate = useNavigate();
  const [isJoinContestModalOpen, setIsJoinContestModalOpen] = useState(false);
  const [contestId, setContestId] = useState<number>(0);
  return (
    <div>
      {label}
      <div className="contest-table">
        <table>
          <thead>
            <tr>
              <th className="first">Name</th>
              <th>Created By</th>
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
                  <td>{contest.username}</td>
                  <td>{contest.max_participants}</td>
                  <td>{contest.duration}</td>
                  <td className="last">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setContestId(contest.contest_id);
                        setIsJoinContestModalOpen(true);
                      }}
                    >
                      Join
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {contestList.length === 0 && (
          <div className="w-full p-4 flex justify-center bg-white dark:bg-primary">
            No Active Games
          </div>
        )}
        <Modal
          isOpen={isJoinContestModalOpen}
          setIsOpen={setIsJoinContestModalOpen}
        >
          {(onClose) => (
            <div className="w-96 flex flex-col gap-6 p-3">
              <div>Are you sure you want to join the contest?</div>
              <div className="flex justify-between">
                <Button variant="tertiary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onClose();
                    navigate(`/lobby?contest-id=${contestId}`);
                  }}
                >
                  Join
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ActiveContests;
