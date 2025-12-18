const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("DB CONNECTION FAILED");
        console.error("Code:", err.code);
        console.error("Message:", err.message);
        console.error("SQL State:", err.sqlState);
    } else {
        console.log("DB CONNECTED SUCCESSFULLY");
        connection.release();
    }
});

module.exports = db;
