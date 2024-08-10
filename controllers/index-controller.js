const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const hissabMobel = require("../models/hisaab-mobel");
const { options } = require("../routes/index-router");



module.exports.landingPageController = function (req, res ){
    res.render("index", {loggedin: false});
};

module.exports.registerPageController = function (req, res ){
    res.render("register");
};


module.exports.registerController = async function (req, res ){
    let { email, username, password, name} = req.body;

    if (!email || !password) {
        // req.flash('error', 'Please fill in all required fields.');
        return res.redirect('/register'); // Redirect to login page or display the flash message
    }

    try{
        let user = await userModel.findOne({email});
    if (user) return res.render("you alrady have a account, please login");


    let salt = await  bcrypt.genSalt(10); 
    let hashed  = await bcrypt.hash(password, salt);
    
    user = await userModel.create({
        email,
        name,
        username,
        password:hashed,
    });

  let token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY );
    
  res.cookie("token", token);
  res.redirect("/")

}
    catch(err){
         res.send(err.message);
    }

};

module.exports.loginController = async function (req, res ){
    let {email, password} = req.body;

    if (!email || !password) {
        // req.flash('error', 'Please fill in all required fields.');
        return res.render('index'); // Redirect to login page or display the flash message
    }
    
    let user = await userModel.findOne({email}).select("+password");
    if (!user) res.send("you dont have a account , please create one. ");

    let result =  await bcrypt.compare(password, user.password);
    if (result) {
        let token = jwt.sign(
            {  id: user._id, email: user.email },
            process.env.JWT_KEY
        );

        
        res.cookie("token", token);
        
        res.redirect("/profile")
    }  

    else{
      return    res.send("your details are incorrect.");
    }
};
 
module.exports.logoutController  = async function (req, res ){
   
    res.cookie("token","");
    return res.redirect("/");

};

module.exports.profileController  = async function (req, res , next){
  
    let byDate = Number(req.query.byDate);
    let {startDate, endDate } = req.query;
    
    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1980-01-02");
    endDate = endDate ? endDate : new Date();
  
    let user = await userModel.findOne({email: req.user.email}).populate({
    path: "hisaab",
    match: {createdAt: {$gte: startDate, $lte: endDate}},
    options: { sort: { createdAt: byDate} },
   });
   res.render("profile", {user});

};