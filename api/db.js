// import mysql from "mysql"

// export const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "blog"
// })

import mysql from "mysql2";

// Create a MySQL connection
export const db = mysql.createConnection({
    // host: "127.0.0.1",
    // user: "root",
    // password: "",
    // port: 3306,
    // database: "blog"
        host: "localhost",
    user: "root",
    password: "",
        port: 3306,
    database: "blog"
});

// Connect to MySQL database
db.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


