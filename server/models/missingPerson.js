const mongoose = require('mongoose');

const MissingPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  guardianName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  complexion: { type: String },
  eye: { type: String },
  hair: { type: String },
  build: { type: String },
  height: { type: String },
  weight: { type: String },
  identificationMarks: { type: String },
  nose: { type: String },
  burnMarks: { type: String },
  face: { type: String },
  disabilities: { type: String },
  habit: { type: String },
  image: { type: String, required: true },
  uniqueId: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  faceDescriptor: { type: Array, required: true },
});


const missingPerson = mongoose.model('missing-person', MissingPersonSchema);

module.exports = missingPerson;
