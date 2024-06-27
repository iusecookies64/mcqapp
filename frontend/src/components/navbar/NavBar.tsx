// import { getTheme, toggleTheme } from "../../utils/initializeTheme";
// import { Icon, IconList } from "../Icon/Icon";
// import { Button } from "../button/Button";
import "./NavBar.style.css";
import { useState } from "react";
import moon from "./dark-mode.png";
import sun from "./light-mode.png";
import { getTheme, initializeTheme, toggleTheme } from "../../utils/theme";
import { useUserData } from "../../hooks/useUserData";

export const NavBar = () => {
  // initializing theme
  initializeTheme();
  const [theme, setTheme] = useState<"dark" | "light">(getTheme());
  const { userData } = useUserData();
  const toggleThemeWithState = () => {
    toggleTheme();
    setTheme((prevTheme) => {
      if (prevTheme === "dark") return "light";
      else return "dark";
    });
  };

  return (
    <div className="navbar">
      <div className="title">MCQ Battle</div>
      <div className="flex gap-6 items-center">
        {theme === "dark" && (
          <div
            id="light-theme"
            className="theme-button"
            onClick={toggleThemeWithState}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Switch To Light Mode"
          >
            <img src={sun} />
          </div>
        )}
        {theme === "light" && (
          <div
            id="dark-theme"
            className="theme-button"
            onClick={toggleThemeWithState}
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Switch To Dark Mode"
          >
            <img src={moon} />
          </div>
        )}
        <div>Hello, {userData.username || "Please Login"}</div>
      </div>
    </div>
  );
};
