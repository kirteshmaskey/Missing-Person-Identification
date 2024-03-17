const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const missingPerson = require("../models/missingPerson");
const getCounterValue = require("./uniqueIdCounter");
const {
  sendFoundMail,
  generateOTP,
  sendEmailValidationOTPMail,
} = require("./mailingService");
const OTP = require("../models/OTPSchema");
const bcryptjs = require("bcryptjs");

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

/**
 * For storing the uploaded images when user register the missing person
 */
const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 1024 * 1024, // Limit file size to 1MB
  },
});

/**
 * For storing the search images when user search for the missing person
 */
const searchStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/searched");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const search = multer({
  storage: searchStorage,
  limits: {
    fileSize: 1024 * 1024, // Limit file size to 1MB
  },
});

/**
 * Router to handle the missing person registration
 * TODO: Add validation for multiple faces
 */
router.post(
  "/register",
  upload.single("image"),
  async (req, res) => {
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
      return res
        .status(203)
        .json({ message: "No face detected in the uploaded image." });
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
        return res
          .status(203)
          .json({ message: "The person in image already exist." });
      }
    }

    const counter = await getCounterValue("disabledPerson");
    const newMissingPerson = new missingPerson({
      ...req.body,
      image: filename,
      uniqueId: counter,
      faceDescriptor: Array.from(uploadedImageDescriptor),
    });
    const person = await newMissingPerson.save();
    res.status(201).json({ person });
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

/**
 * Router for missing people list page
 */
router.post("/missing", async (req, res) => {
  let { gender, age, complexion, hair, height, habit } = req.body;
  let query = {};

  if (gender) {
    gender = gender.toLowerCase();
    query.gender = gender;
  }
  if (complexion) {
    complexion = complexion.toLowerCase();
    query.complexion = complexion;
  }
  if (hair) {
    hair = hair.toLowerCase();
    query.hair = hair;
  }
  if (habit) {
    habit = habit.toLowerCase();
    query.habit = habit;
  }
  if (height) {
    height = parseInt(height);
    query.height = { $gte: height - 5, $lte: height + 5 };
  }
  if (age) {
    age = parseInt(age);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - (age + 5));
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - (age - 5));
    query.dob = { $gte: minDate, $lte: maxDate };
  }

  try {
    const { page = 0 } = req.query;
    discard = page * 6;
    const missingPeople = await missingPerson
      .find(query, {
        name: 1,
        uniqueId: 1,
        image: 1,
        guardianName: 1,
        phone: 1,
      })
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

/**
 * Router for searching disabled people
 */
router.post("/search", search.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const filename = req.file.filename;

    const imageBuffer = fs.readFileSync(`./images/searched/${filename}`);
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
      fs.unlinkSync(`./images/searched/${filename}`); // Delete the image
      return res
        .status(203)
        .json({ message: "No face detected in the uploaded image." });
    }

    // Use the face descriptor from the uploaded image for matching
    const uploadedImageDescriptor = faceDetectionResults[0].descriptor;

    // Query the database to find matching face descriptors
    const userData = await missingPerson.find({}).exec();

    let matchedImages = [];
    for (const entry of userData) {
      const storedImageDescriptor = entry.faceDescriptor; // No need for new faceapi.FaceDescriptor()
      const distance = faceapi.euclideanDistance(
        uploadedImageDescriptor,
        storedImageDescriptor
      );

      // You can adjust the threshold for matching
      if (distance < 0.4) {
        const image = fs.readFileSync(`images/uploads/${entry.image}`);
        const matchedImage = {
          uniqueId: entry.uniqueId,
          image: image.toString("base64"),
          name: entry.name,
          distance: distance,
          guardianName: entry.guardianName,
          phone: entry.phone,
        };
        matchedImages.push(matchedImage);
      }
    }
    if (matchedImages.length > 0)
      res
        .status(200)
        .json({ matchedImages: matchedImages, message: "Match found" });
    else res.status(201).json({ message: "No Match found" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/send-email-verify-otp", async (req, res) => {
  const email = req.body.email;
  try {
    // send email verification otp
    let otp = generateOTP();
    sendEmailValidationOTPMail(email, otp);
    otp = await bcryptjs.hash(otp, 10);
    await OTP.findOneAndUpdate({ email }, { otp }, { new: true, upsert: true });

    res.status(200).json({ message: "OTP send successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-email-otp", async (req, res) => {
  const { otp } = req.body;
  if (otp.trim() === "" || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid OTP" });
  }
  try {
    const isOTP = await OTP.findOne({ email: req.body.email });
    if (isOTP) {
      const isCorrectOTP = await bcryptjs.compare(otp, isOTP.otp);
      if (isCorrectOTP) {
        OTP.deleteOne({ email: req.body.email });
        res.status(200).json({ message: "Email verified" });
      } else {
        res.status(400).json({ error: "Incorrect OTP" });
      }
    } else {
      res.status(400).json({ error: "OTP expired" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/report-found", async (req, res) => {
  const { name, email, verifyEmail, foundLocation, activity, uniqueId } =
    req.body;

  try {
    const user = await missingPerson.findOne({ uniqueId: uniqueId });
    sendFoundMail(user, req.body);
    res.status(200).json({ message: "Reported to the family" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
