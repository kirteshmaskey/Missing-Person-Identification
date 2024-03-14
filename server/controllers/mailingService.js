const nodemailer = require('nodemailer');

/**
 * Create nodemailer Transporter
 */
const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
});


const sendFoundMail = async (user, person) => {
  const html = `
    <p>${person.name} has found ${user.name} at ${person.foundLocation}</p>
  `
  const status = await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: "Found missing person",
    html: html,
  })
}


module.exports = {sendFoundMail}
