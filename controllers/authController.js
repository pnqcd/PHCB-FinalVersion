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
    const { email } = req.body;
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
        const usrfullname = user.fullName;

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
            <table width="100%" border="0" cellpadding="0" direction="ltr" bgcolor="#f1f1f1" cellspacing="0" role="presentation" style="width: 640px; min-width: 640px; margin:0 auto 0 auto;">
<tbody>

<tr>
	<td>
		<!--Content Starts Here -->
		<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f1f1f1">
		<tr>
			<td height="30" style="line-height:30px;min-height:30px;">
			</td>
		</tr>
		</table>
		<!--Top Header Starts Here -->
		<table border="0" bgcolor="#121212" cellpadding="0" cellspacing="0" width="640" role="presentation" width="640" style="width: 640px; min-width: 640px;" align="center" class="table-container ">
		<tbody>
		<tr width="640" style="width: 640px; min-width: 640px; " align="center">
			<td>
				<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#F4E9D9">
				<tr>
					<td height="35" style="line-height:35px;min-height:35px;">
					</td>
				</tr>
				</table>
				<table cellpadding="0" cellspacing="0" border="0" width="640" style="width: 640px; min-width: 640px;" role="presentation" align="center" bgcolor="#F4E9D9">
				<tr>
					<td align="left">
						<table cellpadding="0" cellspacing="0" border="0" role="presentation" align="center" bgcolor="#F4E9D9">
						<tr>
							<td>
								<table cellpadding="0" cellspacing="0" border="0" align="center" role="presentation">
								<tr>
									<td align="center">
									</td>
								</tr>
								</table>
								<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#F4E9D9">
								<tr>
									<td height="35" style="line-height:35px;min-height:35px;">
									</td>
								</tr>
								</table>
							</td>
						</tr>
						</table>
					</td>
				</tr>
				</table>
			</td>
		</tr>
		</tbody>
		</table>
		<!--Top Header Ends Here -->
		<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f7f8fb">
		<tr>
			<td height="30" style="line-height:30px;min-height:30px;">
			</td>
		</tr>
		</table>
		<table align="center" border="0" cellpadding="0" cellspacing="0" width="640" role="presentation" bgcolor="#f7f8fb" class="table-container ">
		<tbody>
		<tr>
			<td align="left" style="color:#45535C;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:800;font-size:34px;-webkit-font-smoothing:antialiased;line-height:1.2;" class="table-container mobile-title">
				 Mã OTP reset password
			</td>
		</tr>
		<tr>
			<td align="left" style="color:#5a5a5a;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;-webkit-font-smoothing:antialiased;line-height:1.4;" class="table-container">
			</td>
		</tr>
		</tbody>
		</table>
		<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#f7f8fb">
		<tr>
			<td height="60" style="line-height:60px;min-height:60px;">
			</td>
		</tr>
		</table>
		<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
		<tr>
			<td height="30" style="line-height:30px;min-height:30px;">
			</td>
		</tr>
		</table>
		<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
		<tbody>
		<tr>
			<td align="left" style="color:#45535C;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:800;font-size:24px;-webkit-font-smoothing:antialiased;line-height:1.2;" class="table-container mobile-title">
				Chào ${usrfullname},
			</td>
		</tr>
		<tr>
			<td align="left" style="color:#5a5a5a;padding:20px 40px 0 40px;font-family: 'Lato', Arial, Helvetica, sans-serif;font-weight:normal;font-size:14px;-webkit-font-smoothing:antialiased;line-height:1.4;" class="table-container">
				 Hệ thống Ads Management đã nhận được yêu cầu reset mật khẩu từ ${email} của bạn. 
                 <br><b>Mã OTP reset mật khẩu:
                 <div class="grey-text-box" style = "font-size: 28px;
                 background-color: #f0f0f0; /* Light grey background color */
                 padding: 10px; /* Adjust the padding as needed */
                 border: 1px solid #ccc; /* Optional border for the text box */
                 color: #000; /* Black text color */
                 width: 220px;
                 height: 35px;">
                 ${otp}
                </div>
                 
                 <br><br>Hãy liên hệ với chúng tôi khi bạn gặp khó khăn trong quá trình sử dụng ứng dụng thông qua email: <a href="mailto:ptudw.group.4@gmail.com" target="_blank" class="link t-grey-1" style="text-decoration:underline; color:#4f48e0;">ptudw.group.4@gmail.com
</a>.
				<br>Xin cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Kính chúc bạn có những trải nghiệm tuyệt vời khi thực hiện giao dịch trên hệ thống Ads Management. 
                 <br><br><br>Trân trọng,
                 <br>Ads Management.
                 
                 <br><br><br><b>Lưu ý:</b> Không chia sẻ mã OTP này cho bất kỳ ai để tránh bị đánh cắp tài khoản. Mã OTP reset mật khẩu này chỉ có hiệu lực trong vòng <b>01 phút</b> kể từ thời điểm nhận được.
			</td>
		</tr>
		</tbody>
		</table>
		<table cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" bgcolor="#FFFFFF">
		<tr>
			<td height="60" style="line-height:60px;min-height:60px;">
			</td>
		</tr>
		</table>
		
		<table bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
		<tr>
			<td height="35" style="line-height:35px;min-height:35px;">
			</td>
		</tr>
		</table>
		<table bgcolor="#f1f1f1" cellpadding="0" cellspacing="0" border="0" align="center" width="640" style="width: 640px; min-width: 640px;" role="presentation" class="table-container ">
		<tr>
			<td height="35" style="line-height:35px;min-height:35px;">
			</td>
		</tr>
		</table>`,
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
    let { newPassword } = req.body;
    const userEmail = req.session.email;

    const user = await models.User.findOne({ where: { email: userEmail } });

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        await models.User.update(
            { password: hashedPassword },
            { where: { email: userEmail } }
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