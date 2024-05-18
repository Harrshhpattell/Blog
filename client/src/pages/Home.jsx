import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { io } from "socket.io-client";
import { AuthContext } from "../context/authContext";
const socket = io("http://localhost:8800");

socket.on("connect", ()=>{
  console.log("socket io connected", socket.id)
})

const fetchPosts = async (category) => {
  const response = await fetch(`http://localhost:8800/api/posts${category}`, {
    withCredentials: true,
  });
  const data = await response.json();
  return data;
};
const fetchPostsLike = async () => {
  const res = await axios.get(`http://localhost:8800/api/users/likes`, {
    withCredentials: true,
  });
  return res.data;
};


const UnlikedIcon = (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="#2c9caf"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"
    />
  </svg>
);

const LikedIcon = (
  <svg
    className="w-6 h-6 text-gray-800 dark:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
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

const Home = () => {
  const cat = useLocation().search;
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?.id;
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState(null);
  const updatePostLikeMutation = useMutation((postId) =>
    axios.post(
      `http://localhost:8800/api/users/likes/${currentUser.id}/${postId}`,
      null,
      {
        withCredentials: true,
      }
    )
  );
  // ***************** React Queries (start) ******************
  const {
    isLoading,
    error,
    data: posts,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts", cat],
    queryFn: () => fetchPosts(cat),
    staleTime: 10000,
  });

  const {
    isLoading: isLoadingLikes,
    data: likes,
    refetch: refetchPostsLikes,
  } = useQuery({
    queryKey: ["postLike"],
    queryFn: () => fetchPostsLike(),
    staleTime: 10000,
    // refetchInterval: 10000,
  });
// console.log("likes", likes);
  // ***************** React Queries (end) ******************
  // ***************** socket io (start) ******************

  useEffect(() => {
    // Fetch initial data
    fetchPostsLike();

    // Listen for socket events
    socket.on("newPost", () => {
      refetchPosts();
    });

    socket.on("postLike", () => {
      refetchPostsLikes();
    });

    socket.on("postUnlike", () => {
      refetchPostsLikes();
    });

    // notification
    socket.emit("joinRoomForNotification", userId);

    // Log when the client joins the room
    socket.on("notificationRoomJoined", (userId) => {
      console.log(`Joined room for user ${userId}`);
    });

    socket.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
      toast(`someone ${notification.content}`);
    });

    return () => {
      // Clean up socket listeners when component unmounts
      socket.off("newPost");
      socket.off("postLike");
      socket.off("postUnlike");
      socket.off("newNotification");
      socket.off("roomJoined");
    };
  }, [cat, refetchPosts, refetchPostsLikes, userId]);

  // ***************** socket io (end) ******************

  const handleLikeBtnClick = async (postId) => {
    const userId = currentUser.id;
    try {
      await updatePostLikeMutation.mutateAsync(postId, {
        onSuccess: () => {
          queryClient.invalidateQueries("postLike");
        },
      });
      socket.emit("like", { postId, userId });
      console.log("Post liked successfully!");
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>error...{error}</p>;
  }
  
  return (
    <div className="home">
      <ToastContainer />
      <div className="posts">
        {posts?.map((post) => {
          const postLike = likes?.postwiselike?.find(
            (like) => like.postid === post.id
          );
          const totalLikes = postLike ? postLike.totalLikes : 0;
          const likedByCurrentUser = likes?.userlikeposts
            ? likes.userlikeposts.some((like) => like.postid === post.id)
            : false;

          return (
            <div className="post" key={post.id}>
              <div className="img">
                <img src={`http://localhost:8800/uploads/${post.img}`} alt="" />
              </div>
              <div className="content">
                <Link className="link" to={`/post/${post.id}`}>
                  <h1>{post.title}</h1>
                </Link>
                <p>{getText(post.description)}</p>
                <Link className="link" to={`/post/${post.id}`}>
                  <button className="buttonReadMore">Read More</button>
                </Link>
                <div
                  // className="likeBtn"
                  className="likeBtnSection"
                >
                  {likes?.userlikeposts ? (
                    <button
                      className="likeBtn"
                      onClick={() => handleLikeBtnClick(post.id)}
                    >
                      {likedByCurrentUser ? LikedIcon : UnlikedIcon}
                    </button>
                  ) : (
                    <Link to="/login">
                      <button className="likeBtn">{UnlikedIcon}</button>
                    </Link>
                  )}
                  <p>{isLoadingLikes ? "Loading..." : totalLikes}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
