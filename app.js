const express = require ("express");
const app = express();

require("dotenv").config();

const indexRouter = require ("./routes/index-router.js")
const db = require ("../project/config/mongoose-connection")

app.get("/", indexRouter);


app.listen(3000 , console.log("server run on 7000"));
