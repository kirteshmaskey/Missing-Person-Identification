const mongoose = require('mongoose');

const MissingPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  areaOfIncident: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  reportingPoliceStation: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  faceDescriptor: { type: Array, required: true },
});

const missingPerson = mongoose.model('missing-person', MissingPersonSchema);

module.exports = missingPerson;
