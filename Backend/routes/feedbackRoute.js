const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../Middleware/authMiddleware");


// ================= ADD FEEDBACK =================
router.post("/add", verifyToken, (req, res) => {

const userId = req.user.id;

const {
name,
phone,
feedback_type,
rating,
message
} = req.body;

// VALIDATION
if(!name || !phone || !feedback_type || !rating || !message){
return res.status(400).json({
message: "All fields required"
});
}

db.query(
`INSERT INTO feedback
(user_id, name, phone, feedback_type, rating, message)
VALUES (?,?,?,?,?,?)`,
[userId, name, phone, feedback_type, rating, message],
(err) => {

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json({
message: "Feedback submitted successfully"
});
});

});


// ================= GET ALL FEEDBACK =================
router.get("/all", verifyToken, (req, res) => {

db.query(
`SELECT * FROM feedback ORDER BY id DESC`,
(err, result) => {

if(err){
console.log(err);
return res.status(500).json(err);
}

res.json(result);

});

});

module.exports = router;