import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const isInputvalid = (inputValue) => {
  let errors = [];

  // Name validation
  if (!inputValue.name || inputValue.name.trim() === '') {
    errors.push('Name is required');
  }
  // Age validation
  else if (!inputValue.age || isNaN(inputValue.age) || inputValue.age <= 0 || inputValue.age >= 120) {
    errors.push('Invalid Age');
  }
  // Gender validation
  else if (!inputValue.gender || !['male', 'female', 'other'].includes(inputValue.gender)) {
    errors.push('Invalid gender');
  }
  // Area of Incident validation
  else if (!inputValue.areaOfIncident || inputValue.areaOfIncident.trim() === '') {
    errors.push('Area of Incident is required');
  }
  // District validation
  else if (!inputValue.district || inputValue.district.trim() === '') {
    errors.push('District is required');
  }
  // State validation
  else if (!inputValue.state || inputValue.state.trim() === '') {
    errors.push('State is required');
  }
  // Reporting Police Station validation
  else if (!inputValue.reportingPoliceStation || inputValue.reportingPoliceStation.trim() === '') {
    errors.push('Reporting Police Station is required');
  }
  // Email validation
  else if (!inputValue.email || !inputValue.email.includes('@')){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    errors.push("Invalid email")
  }
  // Image validation
  else if (!inputValue.image || !(inputValue.image instanceof File) || !['image/jpg', 'image/jpeg', 'image/png'].includes(inputValue.image.type) || inputValue.image.size > 1048576) {
    console.log(inputValue.image instanceof File, inputValue.image.type)
    errors.push('Invalid image. The file must be a jpg, jpeg, or png and no larger than 1MB');
  }

  if(errors.length === 0) return true;
  toast.error(errors[0]);
  return false;
}

const Register = () => {
  const [inputValue, setinputValue] = useState({
    name: "",
    age: "",
    gender: "",
    areaOfIncident: "",
    district: "",
    state: "",
    reportingPoliceStation: "",
    email: "",
    image: null
  }); 
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setinputValue(() => {
        return {
            ...inputValue,
            image: e.target.files[0],
        }
    })
    }
  };

  const setValue = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setinputValue(() => {
        return {
            ...inputValue,
            [name]: value
        }
    })
  };

  const handleUserSignUp = async (e)=> {
    e.preventDefault();

    if(isInputvalid(inputValue)) {
      const formData = new FormData();
      for (const key in inputValue) {
        formData.append(key, inputValue[key]);
      }
      setIsBtnClicked(true);
      axios.post(`${SERVER_URL}register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        if(response.status === 201){
          toast.success("Missing person registered")
          setinputValue({
            name: "",
            age: "",
            gender: "",
            areaOfIncident: "",
            district: "",
            state: "",
            reportingPoliceStation: "",
            email: "",
            image: null
          })
        }else {
          toast.error(response.data.message);
        }
        setIsBtnClicked(false);
      })
      .catch(error => {
        toast.error(error.message)
        console.error(error);
      });
    }
  }

  return (
    <>
    <div className="container my-4">
      <div className="d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-6 border shadow rounded-3 p-3">
          <h2 className="text-center mt-2 mb-4">Register Missing Person</h2>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" onChange={setValue} value={inputValue.name} name="name" id="name" placeholder="Name" required></input>
            <label htmlFor="name">Name</label>
          </div>
          <div className="form-floating mb-2">
            <input type="number" className="form-control" onChange={setValue} value={inputValue.age} name="age" id="age" min="0" max="130"  placeholder="Age" required></input>
            <label htmlFor="age">Age</label>
          </div>
          <div className="form-floating mb-2">
            <select className="form-select" defaultValue="select" onChange={setValue} name="gender" id="gender" required>
              <option selected>--Select--</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="gender">Gender</label>
          </div>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" onChange={setValue} value={inputValue.areaOfIncident} name="areaOfIncident" id="incident"  placeholder="Area of Incident" required></input>
            <label htmlFor="incident">Area of Incident</label>
          </div>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" onChange={setValue} value={inputValue.district} name="district" id="district" placeholder="District" required></input>
            <label htmlFor="district">District</label>
          </div>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" onChange={setValue} value={inputValue.state} name="state" id="state" placeholder="State" required></input>
            <label htmlFor="state">State</label>
          </div>
          <div className="form-floating mb-2">
            <input type="text" className="form-control" onChange={setValue} value={inputValue.reportingPoliceStation} name="reportingPoliceStation" id="reportingPoliceStation" placeholder="Reporting Police Station" required></input>
            <label htmlFor="reportingPoliceStation">Reporting Police Station</label>
          </div>
          <div className="form-floating mb-2">
            <input type="email" className="form-control" onChange={setValue} value={inputValue.email} name="email" id="email" placeholder="Email" required></input>
            <label htmlFor="email">Email</label>
          </div>
          <div className="mb-2">
            <label htmlFor="image" className="">Upload Photo</label>
            <input type="file" className="form-control py-3" onChange={handleImageChange} name="image" id="image" placeholder="Upload Photo" accept="image/png, image/jpeg, image/jpg" required></input>
          </div>
          <div className="mt-4">
            <button type="submit" onClick={handleUserSignUp} className="btn btn-success form-control" disabled={isBtnClicked}>{isBtnClicked? "Registering ..." : "Register"}</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
};

export default Register;
