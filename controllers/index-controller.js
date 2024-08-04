const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");


module.exports.landingPageController = function (req, res ){
    res.render("index");
};

module.exports.registerController = function (req, res ){
    res.render("register");
};


module.exports.postRegisterController = async function (req, res ){
    let { email, username, password, name} = req.body;

    let user = await userModel.findOne({email});
    if (user) return res.render("you alrady have a account, please login");

    let salt = await  bcrypt.genSalt(10); 
    let hashed  = await bcrypt.hash(password, salt);
    
    user = await userModel.create({
        email,
        name,
        ussername,
        password:hashed,
    });



    
};
