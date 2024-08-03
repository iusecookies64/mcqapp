import { useContext, useEffect, useState } from "react";
import Input from "../../components/Input";
import { Loader } from "../../components/Loader";
import { useTopics } from "../../hooks/useTopics";
import Button from "../../components/Button";
import Icon, { IconList } from "../../components/Icon";
import useDebounce from "../../hooks/useDebounce";
import { Topic } from "@mcqapp/types";
import "./MyTopics.style.css";
import { CreateTopicBody, UpdateTopicBody } from "@mcqapp/validations";
import { Modal } from "../../components/Modal";
import DisplayInfo from "../../components/DisplayInfo";
import { toast } from "react-toastify";
import { AuthContext } from "../../components/AuthContext";

export const MyTopics = () => {
  const { user } = useContext(AuthContext);
  const {
    topics,
    createTopic,
    updateTopic,
    deleteTopic,
    isLoadingAction,
    isLoadingTopics,
    error,
  } = useTopics();
  const [searchString, setSearchString] = useState("");
  const debouncedSearchString = useDebounce(searchString);
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  const updateTopicHandler = (data: UpdateTopicBody) => {
    updateTopic(data, () => {
      setUpdateModal(false);
      toast.success("Topic Updated");
    });
  };

  const createTopicHandler = (data: CreateTopicBody) => {
    createTopic(data, () => {
      setCreateModal(false);
      toast.success("Topic Created");
    });
  };

  const deleteTopicHandler = () => {
    if (selectedTopic?.topic_id) {
      deleteTopic({ topic_id: selectedTopic.topic_id }, () => {
        setDeleteModal(false);
        toast.success("Topic Deleted");
      });
    }
  };

  useEffect(() => {
    if (topics) {
      setFilteredTopics(
        topics.filter(
          (t) =>
            t.title.toLowerCase().includes(debouncedSearchString) &&
            t.created_by === user?.user_id
        )
      );
    }
  }, [topics, debouncedSearchString]);

  if (isLoadingTopics) return <Loader />;
  return (
    <div className="my-topics-container">
      <div className="my-topics-header">
        <div className="max-w-lg">
          <Input
            inputType="text"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search Topic"
          />
        </div>
        <Button
          className="flex justify-between items-center gap-2 py-2 justify-self-start h-full"
          tooltip="Create a new question"
          onClick={() => setCreateModal(true)}
        >
          <Icon icon={IconList.plus} /> <span>New Topic</span>
        </Button>
      </div>
      <div className="topic-card-container">
        {filteredTopics.map((t) => (
          <div key={t.topic_id} className="topic-card">
            <div>{t.title}</div>
            <div className="flex gap-3 items-center">
              <Button
                size="sm"
                tooltip="Edit Topic"
                onClick={() => {
                  setSelectedTopic(t);
                  setUpdateModal(true);
                }}
              >
                <Icon icon={IconList.pen} />
              </Button>
              <Button
                variant="alert"
                size="sm"
                tooltip="Delete Topic"
                onClick={() => {
                  setSelectedTopic(t);
                  setDeleteModal(true);
                }}
              >
                <Icon icon={IconList.trash} />
              </Button>
            </div>
          </div>
        ))}
        {topics?.length === 0 && (
          <div className="min-h-96 relative">
            <DisplayInfo type="info" message="No Topics Added Yet" />
          </div>
        )}
      </div>
      <CreateTopicModal
        isLoading={isLoadingAction}
        isOpen={createModal}
        setIsOpen={setCreateModal}
        createTopic={createTopicHandler}
        error={error}
      />
      <UpdateTopicModal
        isLoading={isLoadingAction}
        isOpen={updateModal}
        setIsOpen={setUpdateModal}
        updateTopic={updateTopicHandler}
        topic={selectedTopic}
        error={error}
      />
      <Modal isOpen={deleteModal} setIsOpen={setDeleteModal}>
        <div className="min-w-72 flex flex-col gap-3">
          <div className="text-lg font-medium">Delete Topic</div>
          <div>Are you sure you want to delete the topic</div>
          <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => setDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="alert"
              className="relative"
              onClick={deleteTopicHandler}
            >
              {isLoadingAction && (
                <Loader height={25} width={25} strokeWidth={5} />
              )}
              <div className={isLoadingAction ? "invisible" : ""}>Delete</div>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

type CreateTopicModalProps = {
  createTopic: (data: CreateTopicBody) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: boolean;
};

const CreateTopicModal = ({
  createTopic,
  isOpen,
  setIsOpen,
  isLoading,
  error,
}: CreateTopicModalProps) => {
  const [title, setTitle] = useState<string>("");
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-w-72 flex flex-col gap-3 relative">
        <div className="text-lg font-medium">Create Topic</div>
        <Input
          inputType="text"
          inputLabel="Topic Title"
          placeholder="Enter Topic Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="relative"
            onClick={() => {
              if (title) {
                createTopic({ title: title });
                setTitle("");
              }
            }}
          >
            {isLoading && <Loader height={25} width={25} strokeWidth={5} />}
            <div className={isLoading ? "invisible" : ""}>Create</div>
          </Button>
        </div>
        {error && (
          <DisplayInfo
            type="error"
            message="Error Creating Topic, Try Again Later"
          />
        )}
      </div>
    </Modal>
  );
};

type UpdateModalProps = {
  topic: Topic | null;
  updateTopic: (data: UpdateTopicBody) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  error: boolean;
};

const UpdateTopicModal = ({
  topic,
  updateTopic,
  isOpen,
  setIsOpen,
  isLoading,
  error,
}: UpdateModalProps) => {
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    if (topic?.title) {
      setTitle(topic.title);
    }
  }, [topic]);
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className="min-w-72 flex flex-col gap-3 relative">
        <div className="text-lg font-medium">Update Topic</div>
        <Input
          inputType="text"
          inputLabel="Topic Title"
          placeholder="Enter Topic Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="relative"
            onClick={() => {
              if (topic?.topic_id && title) {
                updateTopic({ topic_id: topic.topic_id, new_title: title });
              }
            }}
          >
            {isLoading && <Loader height={25} width={25} strokeWidth={5} />}
            <div className={isLoading ? "invisible" : ""}>Update</div>
          </Button>
        </div>
        {error && (
          <DisplayInfo
            type="error"
            message="Error Updating Topic, Try Again Later"
          />
        )}
      </div>
    </Modal>
  );
};
