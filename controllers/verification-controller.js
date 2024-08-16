const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
// const nodemailer = require('nodemailer');
const transporter = require("../utils/nodemailer")



module.exports.forgotController =  function (req, res ){
    res.render("forgot-password");
};

module.exports.forgotPageController = async function (req, res ){
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            // req.flash('error_msg', 'User not found.');
            return res.redirect('/forgot-password');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        const resetLink = `http://localhost:${process.env.PORT}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        // req.flash('success_msg', 'Password reset link sent! Please check your email.');
        res.redirect('/');
    } catch (error) {
        console.error('Forgot password error:', error);
        // req.flash('error_msg', 'Error sending reset link.');
        res.redirect('/forgot-password');
    }
};



module.exports.passwordResetController = function (req, res ){
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        res.render('reset-password', { token });
    } catch (error) {
        console.error('Reset password error:', error);
        // req.flash('error_msg', 'Invalid or expired token.');
        res.redirect('/forgot-password');
    }
};

module.exports.passwordResetpostController = async function (req, res ){
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            // req.flash('error_msg', 'User not found.');
            return res.redirect('/forgot-password');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        // req.flash('success_msg', 'Password reset successful! You can now log in with your new password.');
        res.redirect('/');
    } catch (error) {
        console.error('Reset password error:', error);
        // req.flash('error_msg', 'Error resetting password.');
        res.redirect(`/reset-password/${token}`);
    }
};
