const mysql = require("mysql2");

const adminDb = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nithya@03",
  database: "admin_db"
});

adminDb.connect((err) => {
  if (err) {
    console.log("❌ Admin Database connection failed");
    console.log(err);
  } else {
    console.log("✅ Admin Database connected successfully");
  }
});

module.exports = adminDb;