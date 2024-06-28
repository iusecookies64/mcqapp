import { useState } from "react";
import { useContestList } from "../../hooks/useContestList";
import { Icon, IconList } from "../Icon/Icon";
import { CreateContestForm } from "../create_contest_form/CreateContestForm";
import { Modal } from "../modal/Modal";

export const CreateContest = () => {
  const { createContest, isLoadingCud, errorCud } = useContestList();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <>
      <Icon
        icon={IconList.plus}
        toolTip="Create New Contest"
        onClick={() => setIsModalOpen(true)}
      />
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        <CreateContestForm
          createFunction={createContest}
          isLoading={isLoadingCud}
          queryError={errorCud}
          setIsModalOpen={setIsModalOpen}
        />
      </Modal>
    </>
  );
};
