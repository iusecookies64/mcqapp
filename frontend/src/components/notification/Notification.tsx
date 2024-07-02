import { useState } from "react";
import { Icon, IconList } from "../Icon/Icon";
import { Panel } from "../panel/Panel";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../../atoms/notificationAtom";
import "./Notification.style.css";

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, error, notifications } = useNotification();
  const notificationString = (notification: Notification): string => {
    return `${notification.username} is inviting you to participate in contest ${notification.title}`;
  };
  return (
    <>
      <Icon
        icon={IconList.bell}
        toolTip="Notifications"
        onClick={() => setIsOpen(true)}
      />
      <Panel isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="notifications-container">
          <div className="text-xl font-semibold">Notifications</div>
          {notifications && (
            <div className="notification-list">
              {notifications?.length !== 0 && (
                <>
                  {notifications.map((n, indx) => (
                    <div key={indx}>{notificationString(n)}</div>
                  ))}
                </>
              )}
              {notifications?.length === 0 && "No Pending notifications"}
            </div>
          )}
          {isLoading && <div>Loading...</div>}
          {error && <div>Error loading notifications</div>}
        </div>
      </Panel>
    </>
  );
};
