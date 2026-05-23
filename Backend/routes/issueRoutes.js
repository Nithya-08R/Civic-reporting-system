
// const express = require("express");
// const router = express.Router();
// const db = require("../config/db");
// const verifyToken = require("../Middleware/authMiddleware");
// const multer = require("multer");


// // ========= IMAGE STORAGE =========
// const storage = multer.diskStorage({
//  destination: "uploads/",
//  filename: (req, file, cb) => {
//    cb(null, Date.now() + "-" + file.originalname);
//  }
// });

// const upload = multer({ storage });


// // =================================================
// // REPORT ISSUE
// // =================================================
// router.post(
// "/report",
// verifyToken,
// upload.single("image"),
// (req,res)=>{

// const userId = req.user.id;

// const {
//  title,
//  description,
//  category,
//  latitude,
//  longitude,
//  landmark,
//  district,
//  alreadyReported,
//  actionTaken,
//  reason
// } = req.body;
// const image =
// req.file ? req.file.filename : null;


// // ========= AUTO DEPARTMENT =========
// let department="";

// if(category==="Pothole")
// department="Public Works";

// if(category==="Garbage")
// department="Sanitation";

// if(category==="Streetlight")
// department="Electricity";

// if(category==="Drainage")
// department="Water Department";


// // ========= INSERT =========
// db.query(
// `INSERT INTO issues
// (user_id,title,description,
// category,latitude,longitude,
// image_url,department,status,
// landmark,district,
// already_reported,
// action_taken,
// reason)

// VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

// [
// userId,
// title,
// description,
// category,
// latitude,
// longitude,
// image,
// department,
// "Pending",
// landmark,
// district,
// alreadyReported,
// actionTaken,
// reason
// ],

// (err)=>{
//  if(err){
//    console.log(err);
//    return res.status(500).json(err);
//  }

//  res.json({
//  message:"Issue Reported Successfully"
//  });
// });

// });


// // =================================================
// // GET MY ISSUES
// // =================================================
// router.get("/my", verifyToken,(req,res)=>{

// const userId=req.user.id;

// db.query(
// `SELECT * FROM issues
//  WHERE user_id=?
//  ORDER BY id DESC`,
// [userId],
// (err,result)=>{

// if(err){
// console.log(err);
// return res.status(500).json(err);
// }

// res.json(result);

// });

// });


// router.get("/all", verifyToken, (req, res) => {

// try {

// console.log("USER:", req.user);

// // CHECK ADMIN
// if (!req.user || req.user.role !== "admin") {
// return res.status(403).json({
// message: "Access Denied"
// });
// }

// // GET ISSUES
// db.query(
// "SELECT * FROM issues ORDER BY id DESC",
// (err, result) => {

// if (err) {
// console.log("DB ERROR:", err);
// return res.status(500).json({
// message: "Database error"
// });
// }

// console.log("ISSUES:", result);

// res.json(result); // ✅ MUST BE ARRAY
// }
// );

// } catch (error) {
// console.log("SERVER ERROR:", error);
// res.status(500).json({
// message: "Server crash"
// });
// }

// });


// // =================================================
// // UPDATE STATUS (ADMIN)
// // =================================================
// router.put("/update/:id", verifyToken, (req,res)=>{

// if(req.user.role !== "admin"){
// return res.status(403).json({
// message:"Admin Only"
// });
// }

// const issueId = req.params.id;
// const { status, department } = req.body;

// // UPDATE ISSUE
// db.query(
// `UPDATE issues SET status=?, department=? WHERE id=?`,
// [status, department, issueId],
// (err)=>{

// if(err) return res.status(500).json(err);

// // 🔥 GET USER ID OF ISSUE
// db.query(
// "SELECT user_id, title FROM issues WHERE id=?",
// [issueId],
// (err,result)=>{

// if(err) return res.status(500).json(err);

// const userId = result[0].user_id;
// const title = result[0].title;

// // 🔥 CREATE NOTIFICATION
// const message = `Your issue "${title}" is now ${status}`;

// db.query(
// "INSERT INTO notifications (user_id, message) VALUES (?,?)",
// [userId, message],
// (err)=>{

// if(err) console.log("Notification error:", err);

// res.json({
// message:"Issue Updated + Notification Sent ✅"
// });

// });

// });

// });

// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../Middleware/authMiddleware");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();


// ========= IMAGE STORAGE =========
const storage = multer.diskStorage({
 destination: "uploads/",
 filename: (req, file, cb) => {
   cb(null, Date.now() + "-" + file.originalname);
 }
});

const upload = multer({ storage });


// =================================================
// 📧 EMAIL CONFIG
// =================================================
const transporter = nodemailer.createTransport({
 service: "gmail",
 auth: {
   user: process.env.EMAIL_USER,
   pass: process.env.EMAIL_PASS
 }
});


// =================================================
// REPORT ISSUE
// =================================================
router.post(
"/report",
verifyToken,
upload.single("image"),
(req,res)=>{

const userId = req.user.id;

const {
 title,
 description,
 category,
 latitude,
 longitude,
 landmark,
 district,
 alreadyReported,
 actionTaken,
 reason
} = req.body;

const image = req.file ? req.file.filename : null;


// ========= AUTO DEPARTMENT =========
let department = "";

if(category === "Pothole") department = "Public Works";
if(category === "Garbage") department = "Sanitation";
if(category === "Streetlight") department = "Electricity";
if(category === "Drainage") department = "Water Department";


// ========= INSERT =========
db.query(
`INSERT INTO issues
(user_id,title,description,
category,latitude,longitude,
image_url,department,status,
landmark,district,
already_reported,
action_taken,
reason)

VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

[
userId,
title,
description,
category,
latitude,
longitude,
image,
department,
"Pending",
landmark,
district,
alreadyReported,
actionTaken,
reason
],

(err)=>{
 if(err){
   console.log(err);
   return res.status(500).json(err);
 }

 res.json({
 message:"Issue Reported Successfully"
 });
});

});


// =================================================
// GET MY ISSUES
// =================================================
router.get("/my", verifyToken,(req,res)=>{

const userId = req.user.id;

db.query(
`SELECT * FROM issues
 WHERE user_id=?
 ORDER BY id DESC`,
[userId],
(err,result)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);

});

});


// =================================================
// GET ALL ISSUES (ADMIN)
// =================================================
router.get("/all", verifyToken, (req, res) => {

if (!req.user || req.user.role !== "admin") {
return res.status(403).json({
message: "Access Denied"
});
}

db.query(
"SELECT * FROM issues ORDER BY id DESC",
(err, result) => {

if (err) {
console.log("DB ERROR:", err);
return res.status(500).json({
message: "Database error"
});
}

res.json(result || []);

}
);

});


// =================================================
// UPDATE STATUS + NOTIFICATION + EMAIL
// =================================================
router.put("/update/:id", verifyToken, (req,res)=>{

if(req.user.role !== "admin"){
return res.status(403).json({
message:"Admin Only"
});
}

const issueId = req.params.id;
const { status, department } = req.body;

// UPDATE ISSUE
db.query(
`UPDATE issues SET status=?, department=? WHERE id=?`,
[status, department, issueId],
(err)=>{

if(err){
console.log(err);
return res.status(500).json(err);
}

// GET USER + ISSUE DETAILS
db.query(
`SELECT u.email, u.name, i.title, i.user_id
 FROM issues i
 JOIN users u ON i.user_id = u.id
 WHERE i.id=?`,
[issueId],
(err,result)=>{

if(err || result.length === 0){
return res.json({
message:"Updated (No user found)"
});
}

const user = result[0];

// =================================================
// 🔔 CREATE NOTIFICATION
// =================================================
const message = `Your issue "${user.title}" is now ${status}`;

db.query(
"INSERT INTO notifications (user_id, message) VALUES (?,?)",
[user.user_id, message],
(err)=>{
if(err) console.log("Notification error:", err);
});


// =================================================
// 📧 SEND EMAIL ONLY IF RESOLVED
// =================================================
if(status === "Resolved"){

const mailOptions = {
from: process.env.EMAIL_USER,
to: user.email,
subject: "Issue Resolved ✅",
html: `
<h3>Hello ${user.name},</h3>

<p>Your reported issue has been <b>resolved</b>.</p>

<p><b>Issue:</b> ${user.title}</p>

<p>Thank you for contributing to a better city 🙏</p>

<hr>
<p>Civic Issue Portal</p>
`
};

transporter.sendMail(mailOptions, (err, info) => {
if(err){
console.log("MAIL ERROR:", err);
}else{
console.log("MAIL SENT:", info.response);
}
});

}

// FINAL RESPONSE
res.json({
message:"Issue Updated + Notification + Email Sent ✅"
});

});

});

});


module.exports = router;