const express = require ("express");
const app = express();
const path = require ("path");
const cookieParser = require ("cookie-parser");

// const flash = require('connect-flash');
// const expressSession = require ("express-session");


require("dotenv").config();

const indexRouter = require ("./routes/index-router.js");
const hisaabRouter = require ("./routes/hisaab-router.js");
const verificationRouter = require ("./routes/verification-router.js");
const db = require ("../project/config/mongoose-connection");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(express.static(path.join(__dirname , "public")));
app.use(cookieParser());


// app.use(require('flash')());
// app.use(flash());

app.use("/", indexRouter);

app.use("/hisaab", hisaabRouter);

app.use("/", verificationRouter);

// app.get("/profile", function(req,res){
//     res.render(profile)
// })

app.listen(3000 , console.log("server run on 3000"));
 