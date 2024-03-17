import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MissingPersonCard = ({ person }) => {
  const [inputValue, setInputValue] = useState({
    name: "",
    email: "",
    verifyEmail: "",
    phone: "",
    foundLocation: "",
    activity: "",
  });
  const [sendEmail, setSendEmail] = useState(true);
  const [verifyOTP, setVerifyOTP] = useState(false);
  const [foundUniqueId, setFoundUniqueId] = useState();

  const { name, uniqueId, guardianName, phone, image } = person;

  const setValue = (e) => {
    const { name, value } = e.target;
    setInputValue(() => {
      return {
        ...inputValue,
        [name]: value,
      };
    });
  };

  // To verify the users email before reporting found missing
  const sendEmailVerificationOTP = async () => {
    console.log(inputValue.email);
    if (
      inputValue.email.trim() === "" ||
      !/\S+@\S+\.\S+/.test(inputValue.email)
    ) {
      toast.warning("Please enter valid email.");
    } else {
      try {
        const response = await axios.post(
          `${SERVER_URL}send-email-verify-otp`,
          {
            email: inputValue.email,
          }
        );
        if (response.status === 200) {
          setSendEmail(false);
          setVerifyOTP(true);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };

  const verifyEmailOTP = async () => {
    console.log(inputValue.verifyEmail);
    if (
      inputValue.verifyEmail.trim() === "" ||
      inputValue.verifyEmail.length !== 6
    ) {
      toast.warning("Please enter valid OTP");
    } else {
      try {
        const response = await axios.post(`${SERVER_URL}verify-email-otp`, {
          otp: inputValue.verifyEmail,
          email: inputValue.email,
        });
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200) {
          setSendEmail(false);
          setVerifyOTP(false);
          toast.success(response.data.message);
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        console.error("Error sending OTP:", error.response.data);
        toast.error(error.response.data.error);
      }
    }
  };

  // To report that the missing person is identified as missing.
  const handleReportFoundClick = async () => {
    const id = localStorage.getItem("uniqueId");
    inputValue["uniqueId"] = id;

    try {
      const response = await axios.post(
        `${SERVER_URL}report-found`,
        inputValue
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setInputValue({
          ...inputValue,
          name: "",
          email: "",
          verifyEmail: "",
          phone: "",
          foundLocation: "",
          activity: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  const handleShowModelButtonClick = (id) => {
    setFoundUniqueId(id);
    localStorage.setItem("uniqueId", id);
    // To Show the modal
    const modal = document.getElementById("ReportFoundModel");
    if (modal) {
      const bootstrapModal = new window.bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  };

  return (
    <>
      <div className="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
        <div className="card h-100">
          <div className="ratio ratio-4x3">
            <img
              src={`data:image/jpeg;base64,${image}`}
              className="card-img-top"
              alt={image}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="card-body" key={uniqueId}>
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Guardian Name: {guardianName}</p>
            <p className="card-text">Phone: {phone}</p>
            <p className="card-text">Unique Id: {uniqueId}</p>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => handleShowModelButtonClick(uniqueId)}
            >
              Mark Found
            </button>
          </div>
        </div>
      </div>

      {/* Model to verify and report that the person is found. */}
      <div
        className="modal fade"
        id="ReportFoundModel"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ReportFoundModelTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-xl modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title text-success">Confirm Found</h3>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="col-12 col-md-10 border shadow rounded-3 p-3">
                    <div className="card p-1 my-2">
                      <h4 className="text-center my-2 text-primary">
                        Your General Information
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
                          type="email"
                          className="form-control"
                          onChange={setValue}
                          value={inputValue.email}
                          name="email"
                          id="email"
                          placeholder="Email"
                          required
                          disabled={!sendEmail && !verifyOTP}
                        ></input>
                        <label htmlFor="email">Email</label>
                      </div>

                      <div className="row">
                        <div className="col-12 col-md-9">
                          <div className="form-floating mb-2">
                            <input
                              type="email"
                              className="form-control"
                              onChange={setValue}
                              value={inputValue.verifyEmail}
                              name="verifyEmail"
                              id="verifyEmail"
                              placeholder="Verify Email"
                              required
                              disabled={!verifyOTP}
                            />
                            <label htmlFor="verifyEmail">Verify Email</label>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="d-flex justify-content-center align-items center mb-2">
                            {sendEmail && (
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={sendEmailVerificationOTP}
                              >
                                Send OTP
                              </button>
                            )}
                            {verifyOTP && (
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={verifyEmailOTP}
                              >
                                Verify OTP
                              </button>
                            )}
                            {!verifyOTP && !sendEmail && (
                              <span className="email-verified">
                                Email Verified
                              </span>
                            )}
                          </div>
                        </div>
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
                    </div>

                    <div className="card p-1 my-2">
                      <h4 className="text-center my-2 text-primary">
                        Information about the missing
                      </h4>
                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className="form-control"
                          onChange={setValue}
                          value={inputValue.foundLocation}
                          name="foundLocation"
                          id="foundLocation"
                          placeholder="Found Location"
                          required
                        ></input>
                        <label htmlFor="foundLocation">Found Location</label>
                      </div>

                      <div className="form-floating mb-2">
                        <input
                          type="text"
                          className="form-control"
                          onChange={setValue}
                          value={inputValue.activity}
                          name="activity"
                          id="activity"
                          placeholder="Found doing activity"
                          required
                        ></input>
                        <label htmlFor="activity">Found doing activity</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              {!verifyOTP && !sendEmail && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleReportFoundClick}
                >
                  Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MissingPersonCard;
