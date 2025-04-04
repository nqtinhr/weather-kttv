import "./Header.css";
import React, { useState } from "react";

export const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    const event = new CustomEvent("sidebarToggle", { detail: !isSidebarOpen });
    document.dispatchEvent(event);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <button className="btn btn-outline-light me-2" onClick={toggleSidebar}>
        <span className="toggle-icons">☰</span>
      </button>
      <a className="navbar-brand" href="#">
        Trung tâm Thông tin và Dữ liệu KTTV
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {/* <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Contact</a>
            </li>
          </ul> */}
      </div>
    </nav>
  );
};
