const express = require("express");
const cors = require("cors");
const cookieParser = require( "cookie-parser");
//const fetchAndSaveJobs = require('./utils/fetchJobs.js');
require('./workers/cron.js'); // Start the cron job
require('dotenv').config();
const app = express()
 
app.use(cors()) 

app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
// (Optional) Run job fetcher manually

//import userRouter from './routes/user.routes.js'
const getHistoryLogs = require('./routes/getHistoryLogs.route.js');

// routes declaration

//app.use("/api/v1/users", userRouter)
app.use("/api/v1/jobsHistory", getHistoryLogs)


module.exports = app;