const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const missingPerson = require("../models/missingPerson");

const router = new express.Router();

// faceapi setup and canvas setup
faceapi.env.monkeyPatch({
  Canvas: canvas.Canvas,
  Image: canvas.Image,
  ImageData: canvas.ImageData,
});

// Load models from the disk
const modelsPath = "./faceApiModels";
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
  faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
  faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath),
]).then(() => {
  console.log("loaded all the models from the disk");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024, // Limit file size to 1MB
  },
});


/**TODO
 * Add validation for multiple faces
 */
router.post("/register", upload.single("image"), async (req, res) => {
    const { name, age, gender, areaOfIncident, district, state, reportingPoliceStation, email } = req.body;
    const filename = req.file.filename;

    // Load the uploaded image using face-api.js
    const imageBuffer = fs.readFileSync(`./images/uploads/${filename}`);
    const image = new canvas.Image();
    image.src = imageBuffer;

    // Detect faces in the uploaded image and compute face descriptors
    const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5,
    });

    const faceDetectionResults = await faceapi
      .detectAllFaces(image, faceDetectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (faceDetectionResults.length === 0) {
      // No face detected, delete the uploaded image and send a message
      fs.unlinkSync(`./images/uploads/${filename}`); // Delete the image
      return res.status(203).json({message: "No face detected in the uploaded image."});
    }

    // Use the face descriptor from the uploaded image for matching
    const uploadedImageDescriptor = faceDetectionResults[0].descriptor;

    // Query the database to find matching face descriptors
    const matchingImages = await missingPerson.find({}).exec();

    for (const entry of matchingImages) {
      const storedImageDescriptor = entry.faceDescriptor; // No need for new faceapi.FaceDescriptor()
      const distance = faceapi.euclideanDistance(
        uploadedImageDescriptor,
        storedImageDescriptor
      );

      // You can adjust the threshold for matching
      if (distance < 0.4) {
        fs.unlinkSync(`./images/uploads/${filename}`); // Delete the image
        return res.status(203).json({message: "The person in image already exist."});
      }
    }

    const newMissingPerson = new missingPerson({
      name: name,
      age: age,
      gender: gender,
      areaOfIncident: areaOfIncident,
      district: district,
      state: state,
      reportingPoliceStation: reportingPoliceStation,
      email: email,
      image: filename,
      faceDescriptor: Array.from(uploadedImageDescriptor)
    })
    const person = await newMissingPerson.save();
    res.status(201).json({person});
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;