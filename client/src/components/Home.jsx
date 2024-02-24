import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="container mb-3">
        <div className="jumbotron">
          <h1 className="display-4">Missing Person Identification</h1>
          <p className="lead">
            Help us reunite families. If someone you know is missing, take
            action now.
          </p>
          <hr className="my-4" />

          <p>
            Every year, a significant number of individuals go missing in India,
            causing a profound impact on families and communities. At Missing
            Person ID, we are dedicated to providing resources and support to
            aid in the search for missing loved ones.
          </p>
          <p>Here are some key statistics:</p>
          <ul>
            <li>
              The total number of missing persons, women and men, in India in
              2020 was a disturbing 6,70,145
            </li>
            <li>
              Statistics show that 88 individuals go missing every hour, which
              equates to 2,130 people going missing every day, and 64,851 people
              every month
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
            These statistics highlight the scale of the issue and the importance
            of platforms like Missing Person Identification in providing crucial
            resources and support.
          </p>

          <p>
            <strong>
              It's crucial to act quickly and efficiently when someone you know
              goes missing. Below are some steps you can take:
            </strong>
          </p>
          <ul>
            <li>
              <u>File a Police Report:</u> Contact your local law enforcement
              agency immediately
            </li>
            <li>
              <u>Gather Information:</u> Compile details such as recent photos,
              physical description, last known location, and any known
              associates
            </li>
            <li>
              <u>Reach Out:</u> Contact friends, family, and social networks to
              spread the word
            </li>
            <li>
              <u>Use Social Media:</u> Share information on social media
              platforms to reach a wider audience
            </li>
            <li>
              <u>Stay Hopeful:</u> Remember that many missing persons cases end
              with a safe return
            </li>
          </ul>
          <p>
            Missing Person Identificaiton is committed to supporting families
            throughout the search process.
          </p>
          <Link className="btn btn-primary" to="/register" role="button">
            Report Missing Person
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
