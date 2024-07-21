import { useState } from "react";
import { Icon, IconList } from "../Icon";

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
        <Icon icon={IconList.sun} className="h-6 w-6" />
      ) : (
        <Icon icon={IconList.moon} className="h-6 w-6" />
      )}
    </div>
  );
};

export const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  if (savedTheme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
};

export const toggleTheme = (): void => {
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  if (savedTheme === "dark") {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
};

export const getTheme = (): "dark" | "light" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  else {
    // saving theme as light
    localStorage.setItem("theme", "light");
    return "light";
  }
};

export default ThemeToggle;
