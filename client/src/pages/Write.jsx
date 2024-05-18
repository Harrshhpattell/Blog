



import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import { AuthContext } from "../context/authContext";

const Write = () => { 
  const { currentUser } = useContext(AuthContext);
  const state = useLocation().state;
  const [value, setValue] = useState(state?.description || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation((formData) =>
    axios.post("http://localhost:8800/api/upload", formData)
  );

  const createPostMutation = useMutation((postData) =>
    axios.post("http://localhost:8800/api/posts", postData, {
      withCredentials: true,
    })
  );
  // const createPostMutation = useMutation(async (postData) => {
  //   await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 second delay
  //   return axios.post("http://localhost:8800/api/posts", postData, {
  //     withCredentials: true,
  //   });
  // });

  const updatePostMutation = useMutation((postData) =>
    axios.put(
      `http://localhost:8800/api/posts/${state.id}`,
      postData,
      {
        withCredentials: true,
      }
    )
  );

  const handleSuccess = () => {
    queryClient.invalidateQueries("posts");
    navigate("/");
  };

  const handleClick = async (e) => {
    e.preventDefault();

    let imgUrl;

    if (state && state.img && !file) {
      imgUrl = { filename: state.img };
    } else {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await uploadMutation.mutateAsync(formData);
        imgUrl = { filename: data.filename };
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const postData = {
        title,
        desc: value,
        cat,
        img: file ? imgUrl.filename : "",
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      };

      if (state) {
        await updatePostMutation.mutateAsync(postData, {
          onSuccess: handleSuccess,
        });
      } else {
        await createPostMutation.mutateAsync(postData, {
          onSuccess: handleSuccess,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };


  const handleLogin = () => {
    navigate("/login");
  };

  // **********************************************************************
  // const state = useLocation().state;
  // const [value, setValue] = useState(state?.description || "");
  // const [title, setTitle] = useState(state?.title || "");
  // const [file, setFile] = useState(null);
  // const [cat, setCat] = useState(state?.cat || "");

  // const navigate = useNavigate()

  // const upload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const res = await axios.post(
  //       "http://localhost:8800/api/upload",
  //       formData
  //     );
  //     return res.data;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const handleClick = async (e) => {
  //   e.preventDefault();
  //   let imgUrl;

  //   if (state && state.img && !file) {
  //     imgUrl = { filename: state.img };
  //   } else {
  //     imgUrl = await upload();
  //   }

  //   console.log("formData", imgUrl);
  //   try {
  //     state
  //       ? await axios.put(
  //           `http://localhost:8800/api/posts/${state.id}`,
  //           {
  //             title,
  //             desc: value,
  //             cat,
  //             img: file ? imgUrl.filename : "",
  //           },
  //           {
  //             withCredentials: true,
  //           }
  //         )
  //       : await axios.post(
  //           `http://localhost:8800/api/posts`,
  //           {
  //             title,
  //             desc: value,
  //             cat,
  //             img: file ? imgUrl.filename : "",
  //             date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  //           },
  //           {
  //             withCredentials: true,
  //           }
  //         );
  //         navigate("/")
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          {/* <span>
            <b>Status: </b> Draft
          </span> */}
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            {/* <button>Save as a draft</button> */}
            {currentUser ? (
              <button onClick={handleClick}>Publish</button>
            ) : (
              <button onClick={handleLogin}>Login</button>
            )}
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
