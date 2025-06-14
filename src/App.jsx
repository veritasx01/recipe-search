import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import SearchBar, { RecipeCard } from "./search_port.jsx";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [data, setData] = useState(null);

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);
  }, [darkTheme]);

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
      .then((res) => {
        if (!res.ok) throw new Error("failed to fetch");
        return res.json();
      })
      .then((data) => setData(data.meals))
      .catch((err) => console.error(err));
  }, []);

  const fetchMeals = (query) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((result) => {
        // result.meals may be null if no match
        setData(result.meals || []);
      })
      .catch((err) => {
        console.error(err);
        setData([]); // clear on error
      });
  };

  const handleSearch = (query) => {
    fetchMeals(query);
  };

  return (
    <>
      <button
        className={
          darkTheme
            ? "btn btn-outline-light btn-sm"
            : "btn btn-outline-dark btn-sm"
        }
        onClick={() => setDarkTheme((prev) => !prev)}
      >
        Change Theme
      </button>
      <div className="d-flex justify-content-center align-items-center m-2">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="content-wrapper">
        <aside className="category-menu">
          <h4>Categories</h4>
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <button
                  className={activeCategory === category ? "active m-1" : "m-1"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="recipe-container p-3">
          {data.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            data.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                title={meal.strMeal}
                image={meal.strMealThumb}
                link={meal.strYoutube}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default App;
