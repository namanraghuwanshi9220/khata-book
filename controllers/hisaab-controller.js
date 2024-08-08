const hisaabModel = require("../models/hisaab-mobel");
const userModel = require("../models/user-model");
module.exports.createHisaabController = async function (req,res){
 let { title, description, encrypted, shareable, passcode, editpermissions  } =
 req.body;

 encrypted = encrypted === "on" ? true : false ;
 shareable = shareable === "on" ? true : false; 
 editpermissions = editpermissions === "on" ? true : false;

 try{

let hisaabcreated = await hisaabModel.create({
    title,
    description,
    user: req.user._id,
    passcode,
    encrypted,
    shareable,
    editpermissions,
});

let user = await userModel.findOne ({email: req.user.email});
user.hisaab.push(hisaabcreated.id);
await user.save();

res.redirect("/profile")
 }
 catch (err){
    req.send(err.message);
 }

};

module.exports.hisaabPageController = async function  (req, res ) {
    res.render("create");
};
