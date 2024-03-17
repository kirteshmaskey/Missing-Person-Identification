import React, { useEffect, useState } from "react";
import axios from "axios";
import MissingPersonCard from "./reusable/MissingPersonCard";
import { FaFilter } from "react-icons/fa";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const SearchByDescription = () => {
  const [card, setCard] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    gender: "",
    age: "",
    complexion: "",
    hair: "",
    height: "",
    habit: "",
  });

  // To get the Faces of missing person registered in the database based on filter.
  const getMissingPeopleData = async () => {
    if (hasMore) {
      try {
        const res = await axios.post(
          `${SERVER_URL}missing?page=${page}`,
          filters
        );
        const data = res.data;
        setCard((prev) => [...prev, ...data]);
        setLoading(false);
        setHasMore(data.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMissingPeopleData();
  }, [page]);

  const handelInfiniteScroll = async () => {
    try {
      if (
        hasMore &&
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

  const setValue = (e) => {
    const { name, value } = e.target;
    setFilters(() => {
      return {
        ...filters,
        [name]: value,
      };
    });
  };

  const handleFilterSubmit = () => {
    setPage(0); // Reset page to 1 when filters change
    setHasMore(true);
    setLoading(false);
    setCard([]);
    getMissingPeopleData();
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="gender"
                id="gender"
                placeholder="Gender"
                value={filters.gender}
                onChange={setValue}
              />
              <label htmlFor="gender">Gender</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                name="age"
                id="age"
                placeholder="Age"
                value={filters.age}
                onChange={setValue}
              />
              <label htmlFor="age">Age</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="complexion"
                id="complexion"
                placeholder="Complexion"
                value={filters.complexion}
                onChange={setValue}
              />
              <label htmlFor="complexion">Complexion</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="hair"
                id="hair"
                placeholder="Hair"
                value={filters.hair}
                onChange={setValue}
              />
              <label htmlFor="hair">Hair</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="number"
                className="form-control"
                name="height"
                id="height"
                placeholder="Height (cm)"
                value={filters.height}
                onChange={setValue}
              />
              <label htmlFor="height">Height (cm)</label>
            </div>
          </div>
          <div className="col">
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                name="habit"
                id="habit"
                placeholder="Habit"
                value={filters.habit}
                onChange={setValue}
              />
              <label htmlFor="habit">Habit</label>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col text-center">
            <button className="btn btn-primary" onClick={handleFilterSubmit}>
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        <div className="">
          <h1 className="text-center my-4">Registered Missing Persons</h1>
          <div className="row">
            {card.map((person, index) => (
              <MissingPersonCard key={index} person={person} />
            ))}
          </div>
        </div>

        {loading ? "Loading..." : ""}
        {!loading && !hasMore && <p>No more missing persons to display.</p>}
      </div>
    </>
  );
};

export default SearchByDescription;
