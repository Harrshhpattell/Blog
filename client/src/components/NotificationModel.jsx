import React, { useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query';
import axios from "axios";
import { Link } from 'react-router-dom';
import moment from "moment";
import { io } from "socket.io-client";
import { AuthContext } from '../context/authContext';
const socket = io("http://localhost:8800");

const LikedIcon = (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="#2c9caf"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
      clipRule="evenodd"
    />
  </svg>
);

const fetchNotification = async () => {
    const res = await axios.get(
      `http://localhost:8800/api/users/notification`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  };

const NotificationModel = ({ closeNotificationModel, notificationModel }) => {
  const [isExiting, setIsExiting] = useState(false);
  const notificationRef = useRef(null);
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.id;

  // react query

  const {
    isLoading: isLoading,
    data: notification,
    refetch: refetchNotification,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: () => fetchNotification(),
    staleTime: 10000,
    refetchOnWindowFocus: false, // Disable refetch on window focus
    enabled: notificationModel,
  });


  useEffect(() => {
    // Join the room based on the user ID when the component mounts
    socket.emit("joinRoomForNotification", userId);

    // // Log when the client joins the room
    socket.on("notificationRoomJoined", (userId) => {
      console.log(`(noti)Joined room for user from ${userId}`);
    });

    // Listen for new notifications
    socket.on("newNotification", (notification) => {
      console.log("New notification received from noti model:", notification);
      refetchNotification();
    });

    return () => {
      // socket.off("roomJoined");
      socket.off("newNotification");
    };
  }, [refetchNotification]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        handleCancel();
      }
    };

    if (notificationModel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationModel]);

  const handleCancel = () => {
    setIsExiting(true);
    // Delay the execution of closeNotificationModel by 1 second
    setTimeout(() => {
      closeNotificationModel();
      setIsExiting(false);
    }, 500);
  };
  return (
    <div className={notificationModel ? "notificationModelScreen" : ""}>
      <div
        className={
          notificationModel
            ? `notificationModelMainSection${
                isExiting ? " notificationModelMainSectionExit" : ""
              }`
            : "notificationModelMainSectionDisable"
        }
        ref={notificationRef} 
      >
        {notificationModel && (
          <div style={{ height: "100%" }}>
            <div className="noti-header">
              <button onClick={handleCancel}>close</button>
              <p>Notifications</p>
            </div>
            {notification?.length > 0 ? (
              <div className="notificationSectionMain">
                {notification
                  ?.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                  )
                  .map((notifi) => {
                    return (
                      <Link
                        to={`/post/${notifi.post_id}`}
                        onClick={handleCancel}
                        style={{ textDecoration: "none" }}
                      >
                        <div key={notifi.id} className="notificationSection">
                          <div className="noti-top">
                            <div className="notificationCardImg">
                              <img
                                src={`http://localhost:8800/uploads/${notifi.img}`}
                                alt=""
                              />
                            </div>
                            <div className="noti-title">
                              <p>{notifi.title}</p>
                            </div>
                          </div>
                          <div className="noti-likeMessage">
                            <p>
                              {LikedIcon}
                              <span className="noti-username">
                                @{notifi.username}
                              </span>
                              <span>{notifi.content}</span>
                            </p>
                          </div>
                          <div className="noti-bottom">
                            <button>{notifi.cat}</button>
                            <p>{moment(notifi.created_at).fromNow()}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : (
              <p>No Notification</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModel 