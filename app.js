const express = require ("express");
const app = express();
const path = require ("path");

require("dotenv").config();

const indexRouter = require ("./routes/index-router.js")
const db = require ("../project/config/mongoose-connection")

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true }));


app.get("/", indexRouter);

app.listen(3000 , console.log("server run on 000"));
 