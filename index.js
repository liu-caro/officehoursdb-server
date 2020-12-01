const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 4000;

// Enable parsing of .env
require("dotenv").config();

// Connect to MYSQL
const mysql = require("mysql");
let db;

const startDB = () => {
  db = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

  db.connect((err) => {
    if (err) {
      setTimeout(startDB, 2000);
    }
  });

  db.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      startDB();
    } else {
      console.log("Database connection broke :(");
      throw err;
    }
  });
};

startDB();

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS Cross Origin
app.use(cors());

const getAllStudents = () => {
  let getAllStudentsQuery = "CALL getallstudent();";
  return new Promise((resolve, reject) => {
    db.query(getAllStudentsQuery, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

const getAllCoursesByStudent = (name) => {
  let getAllCoursesByStudentQuery = "CALL AllOfficeHours_thatStudent(?);";
  return new Promise((resolve, reject) => {
    db.query(getAllCoursesByStudentQuery, name, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

// App Route functions
app.get("/getAllStudents", async (_req, res) => {
  return res.send(await getAllStudents());
});

app.post("/getAllCoursesByStudent", async (req, res) => {
  return res.send(await getAllCoursesByStudent(req.body.name));
});

app.listen(port, () => console.log("server started on port", port));
