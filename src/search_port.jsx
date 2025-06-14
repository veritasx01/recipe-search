import React from "react";
import { useState, useEffect } from "react";
import ytLogo from "./assets/ytlogo.webp";

export default function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    searchInput.trim();
    onSearch(searchInput);
  };

  return (
    <>
      <form
        className="form-inline my-2 my-lg-0"
        style={{ width: "100%", justifyContent: "center" }}
        onSubmit={handleSubmit}
      >
        <input
          className="input-bar form-control-lg w-50"
          id="input-bar"
          type="search"
          placeholder=""
          aria-label="Search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </form>
    </>
  );
}

export function RecipeCard({ image, title, ytlink, link }) {
  return (
    <div className="recipe-card d-flex align-items-start flex-column">
      <img
        src={image ? image : "/Image-not-found.jpg"}
        className="recipe-image mx-2 mt-2"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/Image-not-found.png";
        }}
        width={200}
        height={200}
      ></img>
      <div className="d-flex p-0 mb-2 ml-2">
        <a
          href={link || ytlink || ""}
          target="_blank"
          rel="noopener noreferrer"
          title={title || "header"} 
          className="text-truncate d-inline-block" 
          style={{ maxWidth: "150px" }} 
        >
          {title || "header"}
        </a>
        <a href={ytlink || link || ""} target="_blank">
          <img
            src={ytLogo}
            alt="yt"
            className="text-truncate d-inline-block" 
            style={{ width: "25px", height: "25px" }} 
          >
          </img>
        </a>
      </div>
    </div>
  );
}
