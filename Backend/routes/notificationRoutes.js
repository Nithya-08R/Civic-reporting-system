const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../Middleware/authMiddleware");


// ================= GET NOTIFICATIONS =================
router.get("/", verifyToken, (req,res)=>{

const userId = req.user.id;

db.query(
"SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC",
[userId],
(err,result)=>{

if(err) return res.status(500).json(err);

res.json(result);

});

});


// ================= MARK AS READ =================
router.put("/read/:id", verifyToken, (req,res)=>{

const id = req.params.id;

db.query(
"UPDATE notifications SET is_read=1 WHERE id=?",
[id],
(err)=>{

if(err) return res.status(500).json(err);

res.json({ message:"Marked as read" });

});

});

module.exports = router;