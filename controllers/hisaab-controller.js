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

module.exports.viewHisaabController = async function  (req, res ) {
    let id = req.params.id;
    let hisaab = await hisaabModel.findOne({_id: id});

    if(!hisaab) {
        return res.redirect("/profile");
    }

    if (hisaab.encrypted){
        return res.render("passcode",  {id});
    }
 
    res.render("hisaab",  {hisaab});
};

module.exports.viewIdHisaabController = async function  (req, res ) {
    res.render("hisaab");
};

module.exports.deleteHisaabController = async function  (req, res ) {
   
    let id = req.params.id;
    let hisaab = await hisaabModel.findOne({
        _id: id,
        user: req.user.id
    });

    if(!hisaab) {
        return res.redirect("/profile");
    }

    await hisaabModel.deleteOne({
        _id: id
    });
   
    return res.redirect("/profile");
};

module.exports.editHisaabController = async function (req, res) {
    
    let id = req.params.id;
    let hisaab = await hisaabModel.findById(id);

    if (!hisaab) {
        return res.redirect("/profile");
    }

    return res.render("edit", {hisaab} );
};

module.exports.editHisaabPostController = async function (req, res) {
    
    let id = req.params.id;
    let hisaab = await hisaabModel.findById(id);

    if (!hisaab) {
        return res.redirect("/profile");
    }

   hisaab.title = req.body.title;
   hisaab.description = req.body.description;
   hisaab.editpermissions = req.body.editpermissions == "on" ? true : false;
   hisaab.encrypted = req.body.encrypted == "on" ? true : false;
   hisaab.passcode = req.body.passcode;
   hisaab.shareable =req.body.shareable  == "on" ? true : false;

   await hisaab.save();

   res.redirect("/profile");

};

module.exports.verifyController = async function (req, res) {

    let id = req.params.id;
    let hisaab = await hisaabModel.findOne({_id: id});

    if (!hisaab) {
        return res.redirect("/profile");
    }

    if (hisaab.passcode !== req.body.passcode){
        return res.redirect("/profile");
    }
  return  res.render("hisaab",{hisaab});
};