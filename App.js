
//require process
const express = require ("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const getConnection = require('./config/db');
const todoRouter = require ('./routes/todo.routes');
const session = require("express-session");
const helmet = require("helmet");

//init process
dotenv.config();
const App = express();
App.use(helmet());

App.use(bodyParser.urlencoded({extended:true}));
App.set("view engine","ejs");
App.use(bodyParser.json());
App.use(express.static("public"));
const App_Port = process.env.PORT || 8000;
const conn= getConnection();

App.use(
  session({
    name: "auth-session",
    secret: "This-is-a-secret",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
);

//middleware
App.use((req, res,next)=>{
   req.conn = conn;
    next();
});

//routes
App.use(todoRouter);



//server activation
App.listen(App_Port,()=>{
    console.log("server is running at port ",App_Port);
});