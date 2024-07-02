import { motion } from "framer-motion";
import "./ContestOptions.style.css";
import { Icon, IconList } from "../../../../components/Icon/Icon";
import { useState } from "react";
import { Modal } from "../../../../components/modal/Modal";
import { UpdateContestForm } from "../update_contest/UpdateContestForm";
import { Contest } from "../../../../types/models";
import { useContestList } from "../../../../hooks/useContestList";

type UpdateContestModalProps = {
  contestData: Contest;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UpdateContestModal = ({
  contestData,
  isOpen,
  setIsOpen,
}: UpdateContestModalProps) => {
  const { updateContest, isLoadingCud, errorCud } = useContestList(false);
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <UpdateContestForm
        contestDetails={contestData}
        isLoading={isLoadingCud}
        queryError={errorCud}
        updateFunction={updateContest}
        setIsModalOpen={setIsOpen}
      />
    </Modal>
  );
};

export const MyContestOptions = ({ contestData }: { contestData: Contest }) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState<boolean>(false);
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
          animate={
            showOptions
              ? { x: 10, opacity: 1, visibility: "visible" }
              : { x: -10, opacity: 0, visibility: "hidden" }
          }
          transition={{ duration: 0.1 }}
        >
          <Icon
            icon={IconList.pen}
            variant="small"
            toolTip="Edit Metadata"
            onClick={() => setIsOpenUpdateModal(true)}
          />
        </motion.div>
        <motion.div
          animate={
            showOptions
              ? { x: 20, opacity: 1, visibility: "visible" }
              : { x: -20, opacity: 0, visibility: "hidden" }
          }
          transition={{ duration: 0.2 }}
        >
          <Icon
            icon={IconList.plus}
            variant="small"
            toolTip="Add/Edit Questions or Publish"
          />
        </motion.div>
        <motion.div
          animate={
            showOptions
              ? { x: 30, opacity: 1, visibility: "visible" }
              : { x: -30, opacity: 0, visibility: "hidden" }
          }
          transition={{ duration: 0.3 }}
        >
          <Icon
            icon={IconList.trash}
            variant="small"
            toolTip="Delete Contest"
          />
        </motion.div>
      </div>
      <UpdateContestModal
        contestData={contestData}
        isOpen={isOpenUpdateModal}
        setIsOpen={setIsOpenUpdateModal}
      />
    </>
  );
};
