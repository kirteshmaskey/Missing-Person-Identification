import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const isInputvalid = (inputValue) => {
  let errors = [];

  // Name validation
  if (!inputValue.name || inputValue.name.trim() === "") {
    errors.push("Name is required");
  }
  // Date of Birth validation
  else if (!inputValue.dob || inputValue.dob.trim() === "") {
    errors.push("Date of Birth is required");
  }
  // Gender validation
  else if (
    !inputValue.gender ||
    !["male", "female", "other"].includes(inputValue.gender)
  ) {
    errors.push("Invalid gender");
  }
  // Guardian Name validation
  else if (!inputValue.guardianName || inputValue.guardianName.trim() === "") {
    errors.push("Guardian Name is required");
  }
  // Email Address validation
  else if (
    inputValue.email.trim() === "" ||
    !/\S+@\S+\.\S+/.test(inputValue.email)
  ) {
    errors.push("Invalid email address");
  }
  // Phone Number validation
  else if (!inputValue.phone || inputValue.phone.trim() === "") {
    errors.push("Phone Number is required");
  }
  // Address validation
  else if (!inputValue.address || inputValue.address.trim() === "") {
    errors.push("Address is required");
  }
  // Blood Group validation
  else if (!inputValue.bloodGroup || inputValue.bloodGroup.trim() === "") {
    errors.push("Blood Group is required");
  }
  // Height validation
  else if (
    !inputValue.height ||
    inputValue.height < 0 ||
    inputValue.height > 275
  ) {
    errors.push("Invalid height");
  }
  // Image validation
  else if (
    !inputValue.image ||
    !(inputValue.image instanceof File) ||
    !["image/jpg", "image/jpeg", "image/png"].includes(inputValue.image.type) ||
    inputValue.image.size > 1048576
  ) {
    errors.push(
      "Invalid image. The file must be a jpg, jpeg, or png and no larger than 1MB"
    );
  }

  if (errors.length === 0) return true;
  toast.error(errors[0]);
  return false;
};

const Register = () => {
  const [inputValue, setinputValue] = useState({
    name: "",
    dob: "",
    gender: "",
    guardianName: "",
    email: "",
    phone: "",
    address: "",
    bloodGroup: "",
    skinColor: "",
    eye: "",
    hair: "",
    build: "",
    height: "",
    weight: "",
    identificationMarks: "",
    nose: "",
    burnMarks: "",
    face: "",
    disabilities: "",
    habit: "",
    image: null,
  });

  const [isBtnClicked, setIsBtnClicked] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setinputValue(() => {
        return {
          ...inputValue,
          image: e.target.files[0],
        };
      });
    }
  };

  const setValue = (e) => {
    const { name, value } = e.target;
    setinputValue(() => {
      return {
        ...inputValue,
        [name]: value,
      };
    });
  };

  const handleUserSignUp = async (e) => {
    e.preventDefault();

    if (isInputvalid(inputValue)) {
      const formData = new FormData();
      for (const key in inputValue) {
        formData.append(key, inputValue[key]);
      }
      setIsBtnClicked(true);
      axios
        .post(`${SERVER_URL}register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 201) {
            toast.success("Missing person registered");
            setinputValue({
              name: "",
              dob: "",
              gender: "",
              guardianName: "",
              email: "",
              phone: "",
              address: "",
              bloodGroup: "",
              skinColor: "",
              eye: "",
              hair: "",
              build: "",
              height: "",
              weight: "",
              identificationMarks: "",
              nose: "",
              burnMarks: "",
              face: "",
              disabilities: "",
              habit: "",
              image: null,
            });
          } else {
            toast.error(response.data.message);
          }
          setIsBtnClicked(false);
        })
        .catch((error) => {
          toast.error(error.message);
          console.error(error);
          setIsBtnClicked(false);
        });
    }
  };

  return (
    <>
      <div className="container my-4">
        <div className="d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-10 border shadow rounded-3 p-3">
            <h2 className="text-center mt-2 mb-4">
              Guardian's Beacon: Register a Missing Mind
            </h2>

            <div className="card p-1 my-2">
              <h4 className="text-center my-2 text-primary">
                General Information
              </h4>
              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.name}
                  name="name"
                  id="name"
                  placeholder="Name"
                  required
                ></input>
                <label htmlFor="name">Name</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="date"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.dob}
                  name="dob"
                  id="dob"
                  min="0"
                  placeholder="Date of Birth"
                  max={new Date().toISOString().split("T")[0]}
                  required
                ></input>
                <label htmlFor="age">Date of Birth</label>
              </div>

              <div className="form-floating mb-2">
                <select
                  className="form-select"
                  defaultValue="select"
                  onChange={setValue}
                  name="gender"
                  id="gender"
                  required
                >
                  <option selected>--Select--</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label htmlFor="gender">Gender</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.guardianName}
                  name="guardianName"
                  id="guardianName"
                  placeholder="Guardian Name"
                  required
                ></input>
                <label htmlFor="guardianName">Guardian Name</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="email"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.email}
                  name="email"
                  id="email"
                  placeholder="Email"
                  required
                ></input>
                <label htmlFor="email">Email</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="tel"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.phone}
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                  required
                ></input>
                <label htmlFor="phone">Phone</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.address}
                  name="address"
                  id="address"
                  placeholder="Address"
                  required
                ></input>
                <label htmlFor="address">Address</label>
              </div>

              <div className="form-floating mb-2">
                <select
                  className="form-select"
                  defaultValue="select"
                  onChange={setValue}
                  name="bloodGroup"
                  id="bloodGroup"
                >
                  <option selected>--Select--</option>
                  <option value="a+">A positive (A+)</option>
                  <option value="a-">A negative (A-)</option>
                  <option value="b+">B positive (B+)</option>
                  <option value="b-">B negative (B-)</option>
                  <option value="ab+">AB positive (AB+)</option>
                  <option value="ab-">AB negative (AB-)</option>
                  <option value="o+">O positive (O+)</option>
                  <option value="o-">O negative (O-)</option>
                </select>
                <label htmlFor="bloodGroup">Blood Group</label>
              </div>
            </div>

            <div className="card p-1 my-2">
              <h4 className="text-center my-2 text-primary">
                Physical Features
              </h4>

              <div className="form-floating mb-2">
                <select
                  className="form-select"
                  defaultValue="select"
                  onChange={setValue}
                  name="complexion"
                  id="complexion"
                >
                  <option selected>--Select--</option>
                  <option value="veryFair">Very Fair</option>
                  <option value="fair">Fair</option>
                  <option value="medium">Medium</option>
                  <option value="olive">Olive</option>
                  <option value="brown">Brown</option>
                  <option value="black">Black</option>
                </select>
                <label htmlFor="complexion">Complexion</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.eye}
                  name="eye"
                  id="eye"
                  placeholder="Eye eg. Normal, Blue"
                ></input>
                <label htmlFor="eye">Eye eg. Normal, Blue</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.hair}
                  name="hair"
                  id="hair"
                  placeholder="Hair eg. Black"
                ></input>
                <label htmlFor="hair">Hair eg. Black</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.build}
                  name="build"
                  id="build"
                  placeholder="Build"
                ></input>
                <label htmlFor="build">Build</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="number"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.height}
                  name="height"
                  id="height"
                  min={0}
                  max={250}
                  placeholder="Height (in cm)"
                ></input>
                <label htmlFor="height">Height (in cm)</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.weight}
                  name="weight"
                  id="weight"
                  placeholder="Weight"
                ></input>
                <label htmlFor="weight">Weight</label>
              </div>
            </div>

            <div className="card p-1 my-2">
              <h4 className="text-center my-2 text-primary">
                Identification Marks
              </h4>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.identificationMarks}
                  name="identificationMarks"
                  id="identificationMarks"
                  placeholder="Identification Marks (If multiple separate by comma)"
                ></input>
                <label htmlFor="identificationMarks">
                  Identification Marks (If multiple separate by comma)
                </label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.nose}
                  name="nose"
                  id="nose"
                  placeholder="Nose"
                ></input>
                <label htmlFor="nose">Nose</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.burnMarks}
                  name="burnMarks"
                  id="burnMarks"
                  placeholder="Burn Marks"
                ></input>
                <label htmlFor="burnMarks">Burn Mark</label>
              </div>
            </div>

            <div className="card p-1 my-2">
              <h4 className="text-center my-2 text-primary">Peculiarities</h4>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.face}
                  name="face"
                  id="face"
                  placeholder="Face"
                ></input>
                <label htmlFor="state">Face</label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.disabilities}
                  name="disabilities"
                  id="disabilities"
                  placeholder="Disabilities (If multiple separate by comma)"
                ></input>
                <label htmlFor="disabilities">
                  Disabilities (If multiple separate by comma)
                </label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="text"
                  className="form-control"
                  onChange={setValue}
                  value={inputValue.habit}
                  name="habit"
                  id="habit"
                  placeholder="Habit (If multiple separate by comma)"
                ></input>
                <label htmlFor="habit">
                  Habit (If multiple separate by comma)
                </label>
              </div>
            </div>

            <div className="mb-2">
              <label htmlFor="image" className="">
                Upload Photo
              </label>
              <input
                type="file"
                className="form-control py-3"
                onChange={handleImageChange}
                name="image"
                id="image"
                placeholder="Upload Photo"
                accept="image/png, image/jpeg, image/jpg"
                required
              ></input>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                onClick={handleUserSignUp}
                className="btn btn-success form-control"
                disabled={isBtnClicked}
              >
                {isBtnClicked ? "Registering ..." : "Register"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
