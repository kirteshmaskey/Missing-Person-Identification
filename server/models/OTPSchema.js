const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const emailValidation = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 2 * 60 * 60,
    default: Date.now(),
  }
});


emailValidation.methods.validateOTP = async function(otp) {
  const status = await bcryptjs.compare(otp, this.otp);
  return status;
}

const OTP = new mongoose.model("otps", emailValidation);

module.exports = OTP;