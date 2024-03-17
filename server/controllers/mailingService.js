const nodemailer = require("nodemailer");

/**
 * Create nodemailer Transporter
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

exports.sendFoundMail = async (user, person) => {
  const html = `
    <p>${person.name} has found ${user.name} at ${person.foundLocation}</p>
  `;
  const status = await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Found missing person",
    html: html,
  });
};

exports.generateOTP = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }
  return otp;
};

exports.sendEmailValidationOTPMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "OTP | Email Verification",
    html: `<p>Your OTP for email verification is:</p>
           <h1>${otp}</h1>
           <br>
           <p>Note: If not done by you then ignore the mail.</p>`,
  });
};
