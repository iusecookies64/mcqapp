import "./NavBar.style.css";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "../Theme";
import { Logout } from "../Logout";

export const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div className="title" onClick={() => navigate("/")}>
        MCQ Battle
      </div>
      <ul className="flex gap-6">
        <li>
          <NavLink
            to="/active-contests"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Active Contests
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-contests"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            My Contests
          </NavLink>
        </li>
      </ul>
      <div className="flex gap-6 items-center">
        <ThemeToggle />
        <Logout />
      </div>
    </div>
  );
};
