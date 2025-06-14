import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import SearchBar, { RecipeCard } from "./search_port.jsx";

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [data, setData] = useState(null);

  const categories = [
    "All",
    "Dessert",
    "Breakfast",
    "Chicken",
    "Goat",
    "Lamb",
    "Miscellaneous",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
  ];

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkTheme);
  }, [darkTheme]);

  useEffect(() => {
    handleCategoryClick(activeCategory);
  }, []);

  const fetchMeals = (query) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((result) => {
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

  // hacky asf but they api doesn't provide links when searching by category
  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    const url =
      category === "All"
        ? "https://www.themealdb.com/api/json/v1/1/search.php?s="
        : `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    fetch(url)
      .then((r) => r.json())
      .then(async (result) => {
        const list = result.meals || [];
        const detailed = await Promise.all(
          list.map((m) =>
            fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`
            )
              .then((r) => r.json())
              .then((j) => j.meals[0])
          )
        );
        setData(detailed);
      })
      .catch(console.error);
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
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="recipe-container p-3">
          {!data || data.length === 0 ? (
            <p>No recipes found.</p>
          ) : (
            data.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                title={meal.strMeal}
                image={meal.strMealThumb}
                ytlink={meal.strYoutube}
                link={meal.strSource}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
export default App;
