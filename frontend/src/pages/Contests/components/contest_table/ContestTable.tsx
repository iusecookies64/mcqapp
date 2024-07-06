import { Contest } from "../../../../types/models";
import { getTimeDetails } from "../../../../utils/getTimeDetails";
import Countdown from "react-countdown";
import { MyContestOptions } from "../contest_options/ContestOptions";
import "./ContestTable.style.css";
import { Button } from "../../../../components/button/Button";
import { useState } from "react";
import { Modal } from "../../../../components/modal/Modal";
import { useNavigate } from "react-router-dom";

type MyContestTableProps = {
  contestList: Contest[];
  publishContest: (contest_id: number, publish: boolean) => void;
};

export const MyContestTable = ({
  contestList,
  publishContest,
}: MyContestTableProps) => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isUnpublishModalOpen, setIsUnpublishModalOpen] =
    useState<boolean>(false);
  const [publishContestId, setPublishContestId] = useState<number>(0);

  return (
    <div className="contest-table">
      <table>
        <thead>
          <tr>
            <th className="first">Name</th>
            <th>Created By</th>
            <th>Max Participants</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
            <th>Before Contest</th>
            <th className="last">Action</th>
          </tr>
        </thead>
        <tbody>
          {contestList.map((contest) => {
            const timeDetails = getTimeDetails(contest.start_time);
            return (
              <tr key={contest.contest_id} className="contest-data-row">
                <td className="first">{contest.title}</td>
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
                <td className="last">
                  {contest.published ? (
                    <Button
                      variant="alert"
                      size="sm"
                      onClick={() => {
                        setPublishContestId(contest.contest_id);
                        setIsUnpublishModalOpen(true);
                      }}
                    >
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setPublishContestId(contest.contest_id);
                        setIsPublishModalOpen(true);
                      }}
                    >
                      Publish
                    </Button>
                  )}
                </td>
                <MyContestOptions contestData={contest} />
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
      <Modal isOpen={isPublishModalOpen} setIsOpen={setIsPublishModalOpen}>
        {(onClose) => (
          <div className="w-96 flex flex-col gap-6 p-3">
            <div>Are you sure you want to publish the contest?</div>
            <div className="flex justify-between">
              <Button variant="tertiary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  publishContest(publishContestId, true);
                  onClose();
                }}
              >
                Publish
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={isUnpublishModalOpen} setIsOpen={setIsUnpublishModalOpen}>
        {(onClose) => (
          <div className="w-96 flex flex-col gap-6 p-3">
            <div>Are you sure you want to unpublish the contest?</div>
            <div className="flex justify-between">
              <Button variant="tertiary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="alert"
                onClick={() => {
                  publishContest(publishContestId, false);
                  onClose();
                }}
              >
                Unpublish
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

type UpcomingContestTableProps = {
  contestList: Contest[];
  joinContest: (contest_id: number) => void;
};

export const UpcomingContestTable = ({
  contestList,
  joinContest,
}: UpcomingContestTableProps) => {
  const [isJoinContestModalOpen, setIsJoinContestModalOpen] = useState(false);
  const [contestId, setContestId] = useState<number>(0);
  return (
    <div className="contest-table">
      <table>
        <thead>
          <tr>
            <th className="first">Name</th>
            <th>Created By</th>
            <th>Max Participants</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
            <th>Before Contest</th>
            <th className="last">Action</th>
          </tr>
        </thead>
        <tbody>
          {contestList.map((contest) => {
            const timeDetails = getTimeDetails(contest.start_time);
            return (
              <tr key={contest.contest_id} className="contest-data-row">
                <td className="first">{contest.title}</td>
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
          No Upcoming Contests
        </div>
      )}
      <Modal
        isOpen={isJoinContestModalOpen}
        setIsOpen={setIsJoinContestModalOpen}
      >
        {(onClose) => (
          <div className="w-96 flex flex-col gap-6 p-3">
            <div>Are you sure you want to joint the contest?</div>
            <div className="flex justify-between">
              <Button variant="tertiary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  joinContest(contestId);
                  onClose();
                }}
              >
                Join
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

type ParticipatedContestTableProps = {
  contestList: Contest[];
};

export const ParticipatedContestTable = ({
  contestList,
}: ParticipatedContestTableProps) => {
  const navigate = useNavigate();
  return (
    <div className="contest-table">
      <table>
        <thead>
          <tr>
            <th className="first">Name</th>
            <th>Created By</th>
            <th>Max Participants</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
            <th>Before Contest</th>
            <th className="last">Action</th>
          </tr>
        </thead>
        <tbody>
          {contestList.map((contest) => {
            const timeDetails = getTimeDetails(contest.start_time);
            return (
              <tr key={contest.contest_id} className="contest-data-row">
                <td className="first">{contest.title}</td>
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
                <td className="last">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(`/lobby?contest-id=${contest.contest_id}`)
                    }
                  >
                    Enter
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {contestList.length === 0 && (
        <div className="w-full p-4 flex justify-center bg-white dark:bg-primary">
          Your Participated Contest Will Appear Here
        </div>
      )}
    </div>
  );
};
