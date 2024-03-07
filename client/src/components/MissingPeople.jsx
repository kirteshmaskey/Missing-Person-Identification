import React, { useEffect, useState } from "react";
import axios from "axios";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MissingPeople = () => {
  const [card, setCard] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const MissingPersonCard = ({ person }) => {
    const { name, uniqueId, guardianName, phone, image } = person;
    return (
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
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Guardian Name: {guardianName}</p>
            <p className="card-text">Phone: {phone}</p>
            <p className="card-text">Unique Id: {uniqueId}</p>
            {/* <button className="btn btn-primary">Mark as Found</button> */}
          </div>
        </div>
      </div>
    );
  };

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