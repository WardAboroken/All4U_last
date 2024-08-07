const express = require("express");
const mysql2 = require("mysql2");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

// Static files
app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "public/images")));

// CORS
app.use(cors());

// JSON parser
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: "your_secret_key", // Replace with your actual secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Routes
const loginRoutes = require("./routes/login");
const userInfoRoutes = require("./routes/userInfo");
const addNewUserRoutes = require("./routes/addNewUser");
const updateProfileRoutes = require("./routes/updateProfile");
const shopRoutes = require("./routes/shop");

app.use("/login", loginRoutes);
app.use("/userInfo", userInfoRoutes);
app.use("/addNewUser", addNewUserRoutes);
app.use("/updateProfile", updateProfileRoutes);
app.use("/shop", shopRoutes);

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
