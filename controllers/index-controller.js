const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
// const nodemailer = require('nodemailer');
const transporter = require("../utils/nodemailer");
const hissabMobel = require("../models/hisaab-mobel");
const { options } = require("../routes/index-router");



module.exports.landingPageController = function (req, res ){
    res.render("index", {loggedin: false});
};

module.exports.registerPageController = function (req, res ){
    res.render("register", {loggedin: false});
};


module.exports.registerController = async function (req, res ){
    let { email, username, password, name} = req.body;

    if (!email || !password) {
        // req.flash('error', 'Please fill in all required fields.');
        return res.redirect('/register'); // Redirect to login page or display the flash message
    }


    
    try {

        let user = await userModel.findOne({email});
            if (user)  {
                // req.flash('error', 'You don’t have an account, please create one.');
                return res.send('bsdk account hai login kar'); 
            }

            
        const hashedPassword = await bcrypt.hash(password, 10);
           user = new userModel({ email, username , name , password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        const verificationLink = `http://localhost:${process.env.PORT}/verification/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Email Verification',
            text: `Click the following link to verify your email: ${verificationLink}`,
        };

        await transporter.sendMail(mailOptions);

        // req.flash('success_msg', 'Signup successful! Please check your email for a verification link.');
        res.redirect('/signup-success');
    } catch (error) {
        console.error('Signup error:', error);
        // req.flash('error_msg', 'Error registering user.');
        res.redirect('/signup-success');
    }
};




//     try{
//         let user = await userModel.findOne({email});
//     if (user)  {
//         // req.flash('error', 'You don’t have an account, please create one.');
//         return res.render('index'); 
//     }


//     let salt = await  bcrypt.genSalt(10); 
//     let hashed  = await bcrypt.hash(password, salt);
    
//     user = await userModel.create({
//         email,
//         name,
//         username,
//         password:hashed,
//     });

//   let token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_KEY );
    
//   res.cookie("token", token);
//   res.redirect("/")

// }
//     catch(err){
//          res.send(err.message);
//     }

// };

module.exports.verificationController = async function (req, res ){
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            req.flash('error_msg', 'Invalid token or user not found.');
            return res.redirect('/signup-success');
        }

        user.isVerified = true;
        await user.save();

        // req.flash('success_msg', 'Email verified successfully!');
        res.redirect('/');
    } catch (error) {
        console.error('Verification error:', error);
        // req.flash('error_msg', 'Invalid or expired token.');
        res.redirect('/signup-success');
    }
}

module.exports.signupSuccessController = async function (req, res){
   res.render("signup-success") 
}

module.exports.loginController = async function (req, res ){
    // let {email, password} = req.body;

    try {
        let { email, password } = req.body;

        if (!email || !password) {
            // req.flash('error', 'Please fill in all required fields.');
            return res.render('index'); // Render the login page with an error message
        }

        let user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            // req.flash('error_msg', 'User not found.');
            return res.redirect('/');
        }

        if (!user.isVerified) {
            // req.flash('error_msg', 'Email not verified.');
            return res.redirect('/');
        }

        let result = await bcrypt.compare(password, user.password);
        // console.log('Password comparison result:', result); // Debugging line

        if (result) {
            let token = jwt.sign(
                { id: user._id, email: user.email },
                process.env.JWT_KEY
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
            });

            return res.redirect("/profile");
        } else {
            // console.log('Incorrect password'); // Debugging line
            // req.flash('error_msg', 'Incorrect password.');
            return res.redirect('/');
        }
    } catch (err) {
        // console.error('Login Error:', err);
        // req.flash('error_msg', 'An error occurred during login. Please try again.');
        return res.redirect('/');
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

module.exports.passcodeController = async function (req, res ){
 
    let id = req.params.id;
    let hisaab = await userModel.findOne({email: req.user.email});
    // let hisaab = await hisaabModel.findById(id);
    res.render("passcode", {hisaab, id});
};