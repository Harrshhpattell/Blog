import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { io } from '../index.js';

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM post WHERE cat=?"
    : "SELECT * FROM post";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

// export const getPosts = (req, res) => {
//   const q = req.query.cat
//     ? "SELECT * FROM post WHERE cat=?"
//     : "SELECT * FROM post";

//   db.query(q, [req.query.cat], (err, data) => {
//     if (err) {
//       return res.status(500).send(err);
//     }

//     // Send fetched posts to the client
//     res.status(200).json(data);

//     // Broadcast to WebSocket clients
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ type: 'posts', data: data }));
//       }
//     });
//   });
// };


export const getPost = (req, res) => {
  const q =
    "SELECT p.id, u.username, p.title, p.description, p.img, u.img AS userImg, p.cat,p.date FROM user u JOIN post p ON u.id = p.uid WHERE p.id = ? ";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  // console.log(req); // Log cookies object
  const token = req.cookies.access_token;
  // console.log("post", token);
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
        "INSERT INTO post(`title`, `description`, `cat`, `img`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.cat,
      req.body.img,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      // Emit new post event to clients
      io.emit('newPost');

      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM post WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");
      // Emit new post event to clients
      io.emit('newPost');
      return res.json("Post has been deleted!");
    });
  });
};


export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const qFetchImage = "SELECT img FROM post WHERE id = ?";
    db.query(qFetchImage, [postId], (err, result) => {
      if (err) return res.status(500).json(err);

      const existingImg = result[0].img;

      let qUpdate =
        "UPDATE post SET `title`=?, `description`=?, `cat`=?";

      let values = [req.body.title, req.body.desc, req.body.cat];

      // Include img in update if provided
      if (req.body.img) {
        qUpdate += ", `img`=?";
        values.push(req.body.img);
      }

      qUpdate += " WHERE `id` = ? AND `uid` = ?";
      values.push(postId, userInfo.id);

      db.query(qUpdate, values, (err, data) => {
        if (err) return res.status(500).json(err);
              // Emit new post event to clients
        io.emit('newPost');
        return res.json("Post has been updated.");
      });
    });
  });
};




