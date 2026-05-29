
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "civic_secret_key";


// ================= REGISTER =================
router.post("/register", async (req, res) => {

try {

const { name, email, password } = req.body;

if (!name || !email || !password) {
return res.status(400).json({
message: "All fields required"
});
}

// HASH PASSWORD
const hashedPassword = await bcrypt.hash(password, 10);

// CHECK USER EXISTS
db.query(
"SELECT * FROM users WHERE email=?",
[email],
(err, result) => {

if (err) {
console.log(err);
return res.status(500).json({ message: "DB Error" });
}

if (result.length > 0) {
return res.json({
message: "User already exists"
});
}

// INSERT USER (DEFAULT ROLE = citizen)
db.query(
"INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
[name, email, hashedPassword, "admin"],
(err) => {

if (err) {
console.log(err);
return res.status(500).json({ message: "Insert Error" });
}

res.json({
message: "Registration successful"
});
}
);
}
);

} catch (error) {
console.log(error);
res.status(500).json({ message: "Server Error" });
}

});


// ================= LOGIN =================
router.post("/login", (req, res) => {

const { email, password } = req.body;

db.query(
"SELECT * FROM users WHERE email=?",
[email],
async (err, result) => {

if (err) {
console.log(err);
return res.status(500).json({ message: "DB Error" });
}

if (result.length === 0) {
return res.json({
message: "User not found"
});
}

const user = result[0];

console.log("USER FROM DB:", user); // ✅ DEBUG

const match = await bcrypt.compare(password, user.password);

if (!match) {
return res.json({
message: "Invalid password"
});
}

// ✅ TOKEN WITH ROLE
const token = jwt.sign(
{
id: user.id,
role: user.role
},
SECRET_KEY,
{ expiresIn: "1d" }
);

// ✅ SEND CLEAN USER OBJECT
console.log("ROLE FROM DB:", user.role);
res.json({
    message: "Login successful",
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.trim()   // 🔥 FORCE CLEAN ROLE
    }
});

}
);

});

module.exports = router;