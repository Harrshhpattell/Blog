import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
import NotificationModel from "./NotificationModel";

const notificationIcon = (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 5.464V3.099m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C19 17.4 19 18 18.462 18H5.538C5 18 5 17.4 5 16.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.464ZM6 5 5 4M4 9H3m15-4 1-1m1 5h1M8.54 18a3.48 3.48 0 0 0 6.92 0H8.54Z"
    />
  </svg>
);

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [notificationModel, setNotificationModel] = useState(false)
  const closeNotificationModel = () => {
    
      setNotificationModel(false);
    
  };
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6>ART</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>SCIENCE</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6>CINEMA</h6>
          </Link>
          <Link className="link" to="/?cat=design">
            <h6>DESIGN</h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6>FOOD</h6>
          </Link>
        </div>
        <div className="links">
          <span>{currentUser?.username}</span>
          {currentUser ? (
            <span onClick={logout}>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
         { currentUser?.id && <span onClick={() => setNotificationModel((isopen) => !isopen)}>
            {notificationIcon}
          </span>}
          {notificationModel &&
          <NotificationModel
            notificationModel={notificationModel}
            closeNotificationModel={closeNotificationModel}
          />}
        </div>
      </div>
    </div>
    // <div className="navbar">
    //   <div className="container">
    //     <div className="logo">
    //       <Link to="/">
    //         <img src={Logo} alt="" />
    //       </Link>
    //     </div>
    //     <div className="links">
    //       <Link className="link" to="/?cat=art">
    //         <h6>ART</h6>
    //       </Link>
    //       <Link className="link" to="/?cat=science">
    //         <h6>SCIENCE</h6>
    //       </Link>
    //       <Link className="link" to="/?cat=technology">
    //         <h6>TECHNOLOGY</h6>
    //       </Link>
    //       <Link className="link" to="/?cat=cinema">
    //         <h6>CINEMA</h6>
    //       </Link>
    //       <Link className="link" to="/?cat=design">
    //         <h6>DESIGN</h6>
    //       </Link>
    //       <Link className="link" to="/?cat=food">
    //         <h6>FOOD</h6>
    //       </Link>
    //     </div>
    //     <div className="links">
    //       <span>{currentUser?.username}</span>
    //       {currentUser ? (
    //         <span onClick={logout}>Logout</span>
    //       ) : (
    //         <Link className="link" to="/login">
    //           Login
    //         </Link>
    //       )}
    //       <span className="write">
    //         <Link className="link" to="/write">
    //           Write
    //         </Link>
    //       </span>
    //       <span className="write" onClick={handleProfileDropDownMenu}>
    //           Profile
    //       </span>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Navbar;