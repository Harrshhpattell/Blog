import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Single = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
const fetchPost = async () => {
  const res = await axios.get(`http://localhost:8800/api/posts/${postId}`, {
    withCredentials: true,
  });
  return res.data;
};

const deletePost = async () => {
  await axios.delete(`http://localhost:8800/api/posts/${postId}`, {
    withCredentials: true,
  });
};

  const { currentUser } = useContext(AuthContext);
  const {
    isLoading,
    error,
    data: post,
  } = useQuery(["post", postId], fetchPost);

  const mutation = useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
      navigate("/");
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching post</div>;

  const handleDelete = async () => {
    mutation.mutate();
  };

  // const getText = (html) =>{
  //   const doc = new DOMParser().parseFromString(html, "text/html")
  //   return doc.body.textContent
  // }

  return (
    <div className="single">
      <div className="content">
        <img src={`http://localhost:8800/uploads/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg ? (
            <img src={post.userImg} alt="" />
          ) : (
            <img src={`http://localhost:8800/uploads/${post?.img}`} alt="" />
          )}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser?.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
        </div>
        <h1>{post.title}</h1>
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.description),
          }}
        ></p>{" "}
      </div>
      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;
