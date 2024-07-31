import { initializeTheme, getTheme, toggleTheme } from "../../utils/theme";
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
        <Icon icon={IconList.sun} className="h-4 w-4" />
      ) : (
        <Icon icon={IconList.moon} className="h-4 w-4" />
      )}
    </div>
  );
};

export default ThemeToggle;
