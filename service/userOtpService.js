const asyncHandler = require("express-async-handler");
require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASSWORD,
  },
});

module.exports = {
  sendOtpVerificationMail: (email) => {
    try {
      return new Promise(async (resolve, reject) => {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        const mailOptions = {
          from: process.env.FROM_EMAIL,
          to: email,
          subject: "Verify Your Email ",
          html: `This is your verification code ${otp}`,
        };
        await transporter
          .sendMail(mailOptions)
          .then((response) => {
            response.otp = otp;
            resolve(response);
          })
          .catch((response) => {
            reject(response);
          });
      });
    } catch (error) {
      console.log("error on node mailer", error);
    }
  },
};
