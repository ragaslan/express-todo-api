/*
@ragaslan 2022 Todo API
Istanbul/Turkey
*/ 

const express = require("express");
const dotenv = require("dotenv");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const cors = require("cors");
const app = express();
app.use(cors());
const path = require("path");
const cookieparser = require("cookie-parser");

dotenv.config();

const connectDatabase = require("./helpers/database/dbConnection");
const port = process.env.PORT;

const router = require("./routers/router");

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(cookieparser());
// create mongo connection
connectDatabase();
//for body parse process
app.use(express.json());
// router
app.use("/api",router);
// custom Error Handler
app.use(customErrorHandler);
//static files settings
app.use(express.static(path.join(__dirname,"public")));

app.listen(port,()=>{
    console.log("App started at : ",port);
});