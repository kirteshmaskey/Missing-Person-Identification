import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "../asset/images/home-banner-image.jpg";
import Upload from "../asset/images/Upload.png";
import Analysis from "../asset/images/analysis.png";
import Match from "../asset/images/match.png";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  const workInfoData = [
    {
      image: Upload,
      title: "Upload photo",
      text: "User will upload the photo and fill the necessary details .",
    },
    {
      image: Analysis,
      title: "Analysis",
      text: "Using deep learning our system is checking 128 parameters and based on that shows result. ",
    },
    {
      image: Match,
      title: "Match found",
      text: "Generate notification to the registered family member/relatives.",
    },
  ];
  return (
    <>
      <div className="px-2">
        <div className="home-container">
          <div className="home-banner-container">
            <div className="home-text-section">
              <h1 className="primary-heading">Reunite. Restore. Reconnect.</h1>
              <p className="primary-text">
                The most advanced platform for identifying missing persons.
                Using cutting-edge technology to bring families back togeather.
              </p>
              <Link to="/register" className="secondary-button">
                Upload Now <FiArrowRight />{" "}
              </Link>
            </div>
            <div className="home-image-section">
              <img src={BannerImage} alt="" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="work-section-top">
            <h1 className="">How It Works</h1>
            <p className="primary-text">
              Our system works using deep learning and the whole process is
              followed in 3 steps as -
            </p>
          </div>
          <div className="work-section-bottom">
            {workInfoData.map((data) => (
              <div className="work-section-info" key={data.title}>
                <div className="info-boxes-img-container">
                  <img src={data.image} alt="" />
                </div>
                <h2>{data.title}</h2>
                <p>{data.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="work-section-wrapper">
          <div className="work-section-top">
            <h1 className="">What We Found</h1>
          </div>

          <div className="container">
            <p>
              Every year, a significant number of individuals go missing in
              India, causing a profound impact on families and communities. At
              Missing Person Identification, we are dedicated to providing
              resources and support to aid in the search for missing loved ones.
            </p>
            <p>Here are some key statistics:</p>
            <ul>
              <li>
                The total number of missing persons, women and men, in India in
                2020 was a disturbing 6,70,145
              </li>
              <li>
                Statistics show that 88 individuals go missing every hour, which
                equates to 2,130 people going missing every day, and 64,851
                people every month
              </li>
              <li>
                In 2020, 4,23,655 women and 2,46,343 men were reported missing
              </li>
              <li>
                According to the National Crime Records Bureau (NCRB), in 2019,
                82,619 girls and 3,29,504 women went missing
              </li>
            </ul>

            <p>
              These statistics highlight the scale of the issue and the
              importance of platforms like Missing Person Identification in
              providing crucial resources and support.
            </p>

            <p>
              <strong>
                It's crucial to act quickly and efficiently when someone you
                know goes missing. Below are some steps you can take:
              </strong>
            </p>
            <ul>
              <li>
                <u>File a Police Report:</u> Contact your local law enforcement
                agency immediately
              </li>
              <li>
                <u>Gather Information:</u> Compile details such as recent
                photos, physical description, last known location, and any known
                associates
              </li>
              <li>
                <u>Reach Out:</u> Contact friends, family, and social networks
                to spread the word
              </li>
              <li>
                <u>Use Social Media:</u> Share information on social media
                platforms to reach a wider audience
              </li>
              <li>
                <u>Stay Hopeful:</u> Remember that many missing persons cases
                end with a safe return
              </li>
            </ul>
            <p>
              Missing Person Identificaiton is committed to supporting families
              throughout the search process.
            </p>
            <h4>
              Help us reunite families. If someone you know is missing, take
              action now.
            </h4>
          </div>
        </div>

        <div className="contact-page-wrapper mt-5">
          <h1 className="">Have Question In Mind?</h1>
          <h1 className="">Let Us Help You</h1>
          <div className="contact-form-container">
            <input type="text" placeholder="Ask your question..." />
            <button className="ms-2 secondary-button">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
