import { useState, useRef, useEffect } from "react";
import { MdNotifications } from "react-icons/md";
import Icon from "../../icon/Icon";

import NotificationMenuItem from "./NotificationMenuItem";
import {
  clearNotifications,
  getPagedNotifications,
  removeNotification,
  type GetPagedNotificationsRequest,
} from "../../../services/notificationService";
import type { NotificationModel } from "../../types/NotificationModel";
import { useSignalR } from "../../../hooks/useSignalR";
import { useNavigate } from "react-router";
import { playSound } from "../../../utils/playSound";
import { toast } from "react-toastify";
import Notification from "../../notifications/Notification";
export default function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { connection } = useSignalR();
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // <-- loading state
  const [unreadCounter, setUnreadCounter] = useState<number>(0);
  const pageSize = 4;

  const fetchData = async (page: number) => {
    setLoading(true);
    const request: GetPagedNotificationsRequest = {
      pageNumber: page,
      pageSize: pageSize,
    };
    const response = await getPagedNotifications(request);

    if (response.items.length < pageSize) {
      setHasMore(false);
    }

    setNotifications((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const newItems = response.items.filter((n) => !existingIds.has(n.id));
      return [...prev, ...newItems];
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el || !hasMore || loading) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
      fetchData(nextPage);
    }
  };

  useEffect(() => {
    if (!connection) return;

    connection.on("ReceiveNotification", (notification: NotificationModel) => {
      console.log("Received notification", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCounter((prev) => prev + 1);
      playSound("/sounds/notificationsound.mp3");

      toast(
        (t) => (
          <Notification
            {...t}
            userName={notification.fromUserName}
            accountId={notification.fromUserId}
            pictureUrl={notification.pictureUrl ?? ""}
            type={notification.type}
            payload={notification.payload ?? ""}
          />
        ),
        {
          position: "bottom-right",
          className: "p-0 !bg-transparent shadow-none border-0",
          theme: undefined,
          hideProgressBar: true,

          closeButton: false,
        },
      );
    });

    return () => {
      connection.off("ReceiveNotification");
    };
  }, [connection]);

  //When menu opens set all notification counter to 0
  useEffect(() => {
    setUnreadCounter(0);
  }, [open]);

  const onNotificationClick = async (notificationId: string, route: string) => {
    await removeNotification(notificationId);

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    setUnreadCounter(0);

    navigate(route);
  };

  const onClearNotificationsClicked = async () => {
    await clearNotifications();
    setNotifications([]);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer rounded-full p-0.5 hover:bg-neutral-500"
      >
        <Icon icon={MdNotifications} />
        {unreadCounter > 0 && (
          <span className="absolute  bottom-2 right-1 translate-x-1/2 translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCounter}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 rounded-md shadow-xl z-50">
          <ul
            ref={listRef}
            onScroll={handleScroll}
            className="py-1 text-white max-h-64 overflow-y-auto space-y-1"
          >
            {notifications.map((notification) => (
              <NotificationMenuItem
                key={notification.id}
                notificationModel={notification}
                onNotificationClick={onNotificationClick}
              />
            ))}

            {loading && (
              <li className="text-center text-sm text-gray-400 py-2">
                Loading...
              </li>
            )}
          </ul>

          <button
            onClick={onClearNotificationsClicked}
            className="w-full p-1 mt-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-white rounded-b-md transition-colors"
          >
            Clear Notifications
          </button>
        </div>
      )}
    </div>
  );
}
