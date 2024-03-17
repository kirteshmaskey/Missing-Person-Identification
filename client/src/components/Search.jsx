import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import upload from "../asset/images/upload_image.png";
import axios from "axios";
import { toast } from "react-toastify";
import MissingPersonCard from "./reusable/MissingPersonCard";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function Search(props) {
  const [files, setFiles] = useState([]);
  const [matchedFaces, setMatchedFaces] = useState([]);
  const [btnClicked, setBtnClicked] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleSearch = async () => {
    if (files.length === 0) {
      toast.warning("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", files[0]);

    try {
      setBtnClicked(true);
      const response = await axios.post(`${SERVER_URL}search`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setBtnClicked(false);
        setMatchedFaces(response.data.matchedImages);
        toast.success(response.data.message);
      } else if (response.status === 201) {
        setBtnClicked(false);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const thumbs = files.map((file) => (
    <div key={file.name} className="mt-3 text-center">
      <img
        src={file.preview}
        alt={file.name}
        className="img-fluid rounded"
        style={{ maxWidth: "20rem", maxHeight: "auto" }}
      />
    </div>
  ));

  return (
    <div className="container mb-4">
      <div className="d-flex justify-content-center align-items-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div
            {...getRootProps()}
            className="m-2 border shadow rounded-3 text-center p-4 image_container"
          >
            <input {...getInputProps()} />
            <div>
              <img
                src={upload}
                alt="Upload"
                className="img-fluid mb-3"
                style={{ maxWidth: "100px" }}
              />
              <p className="m-0">
                Drag and drop your images here, or click to select files
              </p>
              <div className="mt-4">
                <div className="d-flex flex-wrap justify-content-center align-items-center">
                  {thumbs}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={handleSearch}
              className="btn btn-primary mt-3"
              disabled={btnClicked}
            >
              {btnClicked ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* To show the matched face from the database */}
      <div className="container mt-4">
        <div className="row">
          {matchedFaces.map((person, index) => (
            <MissingPersonCard key={index} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
