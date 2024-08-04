const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    email:{
         type: String,
         required: true,
    },
    profilepicture: String,
    password:{
        type: String,
        required: true,
        select: false,
   },
    hisaab: [{  type: mongoose.Schema.Types.ObjectId, ref: "hisaab"  }],
}) 

module.exports = mongoose.model("user", userSchema);