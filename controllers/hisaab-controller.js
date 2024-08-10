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
    
    let byDate = Number(req.query.byDate);
    let {startDate, endDate } = req.query;
    
    byDate = byDate ? byDate : -1;
    startDate = startDate ? startDate : new Date("1980-01-02");
    endDate = endDate ? endDate : new Date();
  
    let hisaab = await userModel.findOne({email: req.user.email}).populate({
    path: "hisaab",
    match: {createdAt: {$gte: startDate, $lte: endDate}},
    options: { sort: { createdAt: byDate} },
   });
     
    res.render("hisaab",  {hisaab});
};

module.exports.viewIdHisaabController = async function  (req, res ) {
    res.render("hisaab");
};
