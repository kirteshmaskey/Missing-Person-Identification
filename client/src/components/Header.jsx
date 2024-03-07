import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">KHOJ</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/missing-people" className="nav-link">Missing</Link>
            <Link to="/search" className="nav-link">Search</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
