import { db } from "../db.js";
import jwt from "jsonwebtoken";
import { io } from '../index.js';

// ***************** Notification Logic ******************

// Function to send a new notification to the relevant user's room
const sendNotification = (postId, notification) => {
    db.query('SELECT uId FROM post WHERE id = ?', [postId], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return;
        }
        const userId = result[0].uId; // Assuming userId is in result[0]
        // console.log("uid", userId)
        io.to(userId).emit("newNotification", notification);
    });
};

export const getPostLikes = (req, res) => {
    const { userid, postid } = req.params;

    // Check if the user has already liked the post
    db.query('SELECT * FROM postlike WHERE userid = ? AND postid = ?', [userid, postid], (err, result) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal server error" });

        }

        if (result.length === 0) {
            // If the user has not liked the post, add a new like
            db.query('INSERT INTO postlike (userid, postid) VALUES (?, ?)', [userid, postid], (err, result) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                // Insert a new notification into the Notifications table
                const notification = {
                    sender_id: userid,
                    post_id: postid, // Assuming postid is the recipient_id
                    notification_type: 'like',
                    content: 'liked your blog post.',
                };
                db.query('INSERT INTO Notifications SET ?', notification, (err, result) => {
                    if (err) {
                        console.error("Error executing MySQL query:", err);
                        return res.status(500).json({ error: "Internal server error" });
                    }
                    // Emit socket event for new like
                    io.emit("postLike", { userid, postid });
                    sendNotification(postid, notification); // Send notification to the relevant user's room
                    return res.status(200).json({ message: "New like added successfully" });
                });
            });
        } else {
            // If the user has already liked the post, delete the existing like
            db.query('DELETE FROM postlike WHERE userid = ? AND postid = ?', [userid, postid], (err, result) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                // Delete the corresponding notification from the Notifications table
                db.query('DELETE FROM Notifications WHERE sender_id = ? AND post_id = ? AND notification_type = ?', [userid, postid, 'like'], (err, result) => {
                    if (err) {
                        console.error("Error executing MySQL query:", err);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    // Emit socket event for deleted like
                    io.emit("postUnlike", { userid, postid });
                    return res.status(200).json({ message: "Like deleted successfully" });
                });
            });
        }
    });
};

export const getTotalLikesPerPost = (req, res) => {
    const getTotalLikesQuery = 'SELECT postid, COUNT(*) AS totalLikes FROM postlike GROUP BY postid';
    const getUserLikedPostsQuery = 'SELECT postid FROM postlike WHERE userid = ?';
    const token = req.cookies.access_token;

    if (!token) {
        // If user is not authenticated, return total likes per post only
        db.query(getTotalLikesQuery, (err, totalLikesResult) => {
            if (err) {
                console.error("Error executing MySQL query:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            const response = {
                postwiselike: totalLikesResult,
            };
            // console.log("response", response);
            return res.status(200).json(response);
        });
    } else {
        jwt.verify(token, "jwtkey", (err, userInfo) => {
            if (err) return res.status(403).json("Token is not valid!");

            db.query(getTotalLikesQuery, (err, totalLikesResult) => {
                if (err) {
                    console.error("Error executing MySQL query:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                
                db.query(getUserLikedPostsQuery, [userInfo.id,], (err, userLikedPostsResult) => {
                    if (err) {
                        console.error("Error executing MySQL query:", err);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    const response = {
                        postwiselike: totalLikesResult,
                        userlikeposts: userLikedPostsResult
                    };

                    // console.log("response", response);
                    // Send the response as JSON
                    return res.status(200).json(response);
                });
            });
        });
    }
};

export const getNotifications = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const userId = userInfo.id;

        const sqlQuery = `
            Select n.id ,n.sender_id,u.username, n.content, p.uid, n.post_id,p.title, p.cat, p.img, n.created_at
             FROM Notifications AS n 
             INNER JOIN post AS p 
               ON n.post_id = p.id 
             INNER JOIN user AS u 
               ON u.id = n.sender_id 
             WHERE p.uid = ?;
        `;

        // Execute the SQL query with the user ID
        db.query(sqlQuery, [userId], (err, results) => {
            if (err) {
                console.error("Error executing MySQL query:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            // Return the results as JSON
            return res.status(200).json(results);
        });
    });
};




// // API endpoint to get total number of likes per post
// export const getTotalLikesPerPost = (req, res) => {
    
//     const getTotalLikesQuery = 'SELECT postid, COUNT(*) AS totalLikes FROM postlike GROUP BY postid';

//     const getUserLikedPostsQuery = 'SELECT postid FROM postlike WHERE userid = ?';

//     const token = req.cookies.access_token;

//     if (!token) return res.status(401).json("Not authenticated!");
  
//     jwt.verify(token, "jwtkey", (err, userInfo) => {
//       if (err) return res.status(403).json("Token is not valid!");


//     db.query(getTotalLikesQuery, (err, totalLikesResult) => {
//         if (err) {
//             console.error("Error executing MySQL query:", err);
//             return res.status(500).json({ error: "Internal server error" });
//         }
        
//         db.query(getUserLikedPostsQuery, [userInfo.id,], (err, userLikedPostsResult) => {
//             if (err) {
//                 console.error("Error executing MySQL query:", err);
//                 return res.status(500).json({ error: "Internal server error" });
//             }

//             const response = {
//                 postwiselike: totalLikesResult,
//                 userlikeposts: userLikedPostsResult
//             };

//             console.log("response", response);
//             // Send the response as JSON
//             return res.status(200).json(response);
//         });
//     });
//     });
// };
