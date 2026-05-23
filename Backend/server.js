require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send("Civic Reporting API Running");
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

const issueRoutes=require("./routes/issueRoutes");
app.use("/api/issues",issueRoutes);
app.use("/api/issues",
require("./routes/issueRoutes"));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", require("./routes/notificationRoutes"));


const feedbackRoute = require("./routes/feedbackRoute");
app.use("/api/feedback", feedbackRoute);