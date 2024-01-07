const controller = {}
const passport = require('passport');
const pool = require("../database/database");
const models = require("../models");
const nodemailer = require('nodemailer'); // Import nodemailer library
const bcrypt = require("bcrypt");



controller.showIndex = (req, res) => {
    let navUrl;
    if (req.user.isWard) navUrl = "/PHCB-Phuong";
    else if (req.user.isDistrict) navUrl = "/PHCB-Quan";
    else navUrl = "/PHCB-So";

    res.redirect(navUrl);
}

controller.showLogin = (req, res) => {
    // console.log(req.query.reqUrl);
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";

    if (req.user) {
        return res.redirect(reqUrl);
    }

    res.render("login", {
        layout: "auth",
        reqUrl,
    });
}

controller.showForgetPassword = (req, res) => {
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";

    if (req.user) {
        return res.redirect(reqUrl);
    }

    res.render("forgetPassword", {
        layout: "auth",
        reqUrl,
    });
}

// const generateOTP = () => {
//     // Logic to generate a random OTP
//     return Math.floor(100000 + Math.random() * 900000).toString();
// };

const generateOTP = (req) => {
    // Logic to generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the OTP and timestamp in the session
    req.session.otp = otp;
    req.session.otpTimestamp = Date.now(); // Store current timestamp

    return otp;
};

controller.forgetPassword = async (req, res) => {
    const { email} = req.body;
    try {
        // Check if the email exists in the database
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
            // Email not found in the database
            return res.render("forgetPassword", {
                layout: "auth",
                message: "Email không tồn tại trong hệ thống",
            });
        }

        // Generate OTP
        const otp = generateOTP(req);

        // Store the OTP in the session for verification later
        req.session.email = email;

        // Render the page for users to enter the OTP
        res.render("verifyOTP", {
            layout: "auth",
            // message: `Chúng tôi đã gửi mã OTP đến email ${email}. Hãy nhập mã OTP để tiếp tục.`,
        });

        // Send the email using nodemailer (replace with your email sending logic)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ptudw.group.4@gmail.com',
                // generate app password trên gg
                pass: 'qcda cjil wsmn nczq',
            },
        });

        const mailOptions = {
            from: 'ptudw.group.4@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            html: `
            <p>You have selected ${email} as your verification OTP to reset the password.</p>
            <p style ="width: 80px; background-color: #ECECEC; font-size: 20px; font-weight: bold">${otp}</p>
            <p>The code will expire 1 minute after this email was sent.</p>
            <p>Thank you.</p>
            <p>Regard,</p>
            <p style = "font-weight: bold">Ad Management System</p>
            <p style = "font-style: italic">"Best investment we made for a long time. Can only recommend it for other users."</p>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

    } catch (error) {
        console.error("Error in forgetPassword:", error);
        res.render("forgetPassword", {
            layout: "auth",
            message: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.",
        });
    }
};

controller.showVerifyOTP = (req, res) => {
    let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";

    if (req.user) {
        return res.redirect(reqUrl);
    }

    res.render("verifyOTP", {
        layout: "auth",
        reqUrl,
    });
}


controller.verifyOTP = (req, res) => {
    const enteredOTP = req.body.otp;

    // Check if the OTP has expired (more than 1 minute)
    const otpTimestamp = req.session.otpTimestamp || 0;
    const currentTimestamp = Date.now();
    const timeDifference = currentTimestamp - otpTimestamp;

    const expirationTime = 1 * 60 * 1000;

    if (enteredOTP === req.session.otp && timeDifference <= expirationTime) {
        res.render("resetPassword", {
            layout: "auth",
        });
    } else {
        res.render("verifyOTP", {
            layout: "auth",
            message: "Mã OTP không chính xác hoặc đã hết hạn. Hãy thử lại.",
        });
    }
};

controller.resetPassword = async (req, res) => {
    let {newPassword} = req.body;
    const userEmail = req.session.email;

    const user = await models.User.findOne({ where: {email: userEmail} });

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        await models.User.update(
            {password: hashedPassword},
            {where: {email: userEmail}}
        );
        res.send("Đã cập nhật mat khau!");
    } catch (error) {
    res.send("Không thể cập nhật mat khau!");
    console.error(error);
    }
}


controller.showResetPassword = (req, res) => {
    // Render the page for users to reset their password
    res.render("resetPassword", {
        layout: "auth",
        message: "Nhập mật khẩu mới của bạn.",
    });
};


controller.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.render("login", {
            layout: "auth",
            message: "Username hoặc mật khẩu không chính xác"
        });

        let reqUrl = req.query.reqUrl ? req.query.reqUrl : "/";
        req.login(user, (err) => {
            if (err) return next(err);

            return res.redirect(reqUrl);
            // if (user.isWard) {
            //     return res.redirect("/PHCB-Phuong");
            // }
            // else if (user.isDistrict) {
            //     return res.redirect("/PHCB-Quan");
            // }
            // else return res.redirect("/PHCB-So");
        });
    })(req, res, next);
}


controller.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}

// route middleware to ensure user is logged in 
controller.isLoggedIn = async (req, res, next) => {
    if (req.user) {
        res.locals.user = req.user;
        next();
    } else {
        res.redirect(`/login?reqUrl=${req.originalUrl}`);
    }
}

module.exports = controller