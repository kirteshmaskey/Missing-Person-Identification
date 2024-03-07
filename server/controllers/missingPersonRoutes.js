const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const missingPerson = require("../models/missingPerson");
const getCounterValue = require("./uniqueIdCounter");

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


/** 
 * Router to handle the missing person registration
 * TODO: Add validation for multiple faces
 */
router.post("/register", upload.single("image"), async (req, res) => {
    const { name, age, gender, areaOfIncident, district, state, reportingPoliceStation, email, missingDate } = req.body;
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

    const counter = await getCounterValue("disabledPerson");
    const newMissingPerson = new missingPerson({
      ...req.body,
      image: filename,
      uniqueId: counter,
      faceDescriptor: Array.from(uploadedImageDescriptor)
    })
    const person = await newMissingPerson.save();
    res.status(201).json({person});
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);



/**
 * Router for missing people list page
 */
router.get("/missing", async (req, res) => {
  try {
    const { page = 0 } = req.query;
    discard = page * 6;
    const missingPeople = await missingPerson
      .find({}, { name: 1, uniqueId: 1, image: 1, guardianName: 1, phone: 1})
      .skip(discard)
      .limit(6);

    const data = missingPeople.map((person) => {
      const image = fs.readFileSync(`images/uploads/${person.image}`);
      return {
        uniqueId: person.uniqueId,
        image: image.toString("base64"),
        name: person.name,
        guardianName: person.guardianName,
        phone: person.phone,
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;