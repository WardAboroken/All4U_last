const express = require("express"); // ייבוא EXP

const mysql2 = require("mysql2");
const cors = require("cors");
const path = require("path");// נותן אפשרות לבחירת מסלול(ספרייה שעוזרת לנו לעבוד עם מסלולים)


const app = express()
app.use(express.static(path.join(__dirname,"public")))
app.use(cors())

app.use(express.json())

const port = 5000

const loginRoutes = require("./routes/login");

app.use("/login", loginRoutes);

// const dbConfig = mysql.createConnection ({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "final_project",
// });

app.listen(port , () =>{
  console.log(`Server is running on port ${port}`)
})