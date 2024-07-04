import { useEffect, useState } from "react";
import { Modal } from "../../../components/modal/Modal";
import { Input } from "../../../components/input/Input";
import useDebounce from "../../../hooks/useDebounce";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import { Button } from "../../../components/button/Button";

type Props = {
  contest_id: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SendInvitesModal = ({ contest_id, isOpen, setIsOpen }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deboucedSearchValue = useDebounce(searchValue, 300);

  const SendInvites = () => {
    setIsLoading(true);
    api
      .post("/invitation/send-invite", { contest_id, users: selectedUsers })
      .then(
        () => {
          toast.success("Invitations Sent");
          setIsOpen(false);
          setIsLoading(false);
        },
        () => {
          toast.error("Error Sending Requests");
          setIsLoading(false);
        }
      );
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.get(`/users/matching-users?matching=${deboucedSearchValue}`).then(
        (response) => {
          setSearchResult(response.data.data);
          setIsLoading(false);
        },
        () => {
          toast.error("Something Went Wrong, Please Try Again!");
          setIsLoading(false);
        }
      );
    }
  }, [deboucedSearchValue, contest_id]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div>
        <div>
          {selectedUsers.map((user) => (
            <div>{user}</div>
          ))}
        </div>
        <div className="relative my-2">
          <Input
            inputType="text"
            placeholder="Search For Usernames"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchResult.length ? (
            <div className="w-full bg-gray-dark border rounded shadow-sm">
              {searchResult.map((val) => (
                <div
                  className="hover:bg-gray cursor-pointer p-3"
                  onClick={() =>
                    setSelectedUsers((prevSelected) => [...prevSelected, val])
                  }
                >
                  {val}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <Button onClick={SendInvites} className="bg-sky-600 scale-90">
          Send
        </Button>
      </div>
    </Modal>
  );
};
