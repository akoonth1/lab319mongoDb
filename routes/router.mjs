import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import db  from "../db/conn.mjs";
import getSingleGrader from "../controllers/gradeController.mjs";

// Initialize dotenv to use environment variables
dotenv.config();

const router = express.Router();

// Middleware to parse request bodies
router.use(bodyParser.json());

// Define a simple route
router.get("/test", (req, res) => {
    res.send("Hello World a");
});


// Define a route to get a single grade
router.get("/grades/:id", getSingleGrader.getSingleGrade);

// Define a route to get grades for a student
router.get("/grades/student/:id", getSingleGrader.getStudentGrades);

// Define a route to get grades for a class
router.get("/grades/class/:id", getSingleGrader.getClassGrades);

// Define a route to create a grade
router.post("/grades", getSingleGrader.createGrade);


// Define a route to fwt stats
router.get("/grades/stats/all", getSingleGrader.getStats);


router.get("/grades/stats/all/:id", getSingleGrader.getStatsID);



router.post("/grades/schema", getSingleGrader.validation);


export default router;