import { initializeTheme, getTheme, toggleTheme } from "../../utils/theme";
import { useState } from "react";

const ThemeToggle = () => {
  // initializing theme
  initializeTheme();
  const [theme, setTheme] = useState<"dark" | "light">(getTheme());
  const toggleThemeWithState = () => {
    toggleTheme();
    setTheme((prevTheme) => {
      if (prevTheme === "dark") return "light";
      else return "dark";
    });
  };

  return (
    <div
      id="dark-theme"
      className="h-10 w-10 p-2 flex justify-center items-center rounded-full cursor-pointer hover:bg-opacity-25 dark:hover:bg-opacity-25 hover:bg-gray dark:hover:bg-white"
      onClick={toggleThemeWithState}
      data-tooltip-id="my-tooltip"
      data-tooltip-content={`Switch To ${
        theme === "dark" ? "Light" : "Dark"
      } Mode`}
    >
      {theme === "dark" ? (
        <i className="fa-solid fa-sun text-yellow"></i>
      ) : (
        <i className="fa-solid fa-moon"></i>
      )}
    </div>
  );
};

export default ThemeToggle;
