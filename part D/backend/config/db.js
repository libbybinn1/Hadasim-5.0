import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    } else {
        console.log("Connected to the database");
    }
});

export default db;
