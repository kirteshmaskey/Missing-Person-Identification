import React, { useEffect, useState } from "react";
import axios from "axios";
import MissingPersonCard from "./reusable/MissingPersonCard";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MissingPeople = () => {
  const [card, setCard] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // To get the Faces of missing person registered in the database.
  const getMissingPeopleData = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}missing?page=${page}`);
      const data = res.data;
      setCard((prev) => [...prev, ...data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getMissingPeopleData();
  }, [page]);

  const handelInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setLoading(true);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handelInfiniteScroll);
    return () => window.removeEventListener("scroll", handelInfiniteScroll);
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          {card.map((person, index) => (
            <MissingPersonCard key={index} person={person} />
          ))}
        </div>
      </div>

      {loading ? "Loading..." : ""}
    </>
  );
};

export default MissingPeople;