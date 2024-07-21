"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTheme = exports.toggleTheme = exports.initializeTheme = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Icon_1 = require("../Icon");
const ThemeToggle = () => {
    // initializing theme
    (0, exports.initializeTheme)();
    const [theme, setTheme] = (0, react_1.useState)((0, exports.getTheme)());
    const toggleThemeWithState = () => {
        (0, exports.toggleTheme)();
        setTheme((prevTheme) => {
            if (prevTheme === "dark")
                return "light";
            else
                return "dark";
        });
    };
    return ((0, jsx_runtime_1.jsx)("div", { id: "dark-theme", className: "h-10 w-10 p-2 flex justify-center items-center rounded-full cursor-pointer hover:bg-opacity-25 dark:hover:bg-opacity-25 hover:bg-gray dark:hover:bg-white", onClick: toggleThemeWithState, "data-tooltip-id": "my-tooltip", "data-tooltip-content": `Switch To ${theme === "dark" ? "Light" : "Dark"} Mode`, children: theme === "dark" ? ((0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: Icon_1.IconList.sun, className: "h-6 w-6" })) : ((0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: Icon_1.IconList.moon, className: "h-6 w-6" })) }));
};
const initializeTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const html = document.documentElement;
    if (savedTheme === "dark") {
        html.classList.add("dark");
    }
    else {
        html.classList.remove("dark");
    }
};
exports.initializeTheme = initializeTheme;
const toggleTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    const html = document.documentElement;
    if (savedTheme === "dark") {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
    }
    else {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
};
exports.toggleTheme = toggleTheme;
const getTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark")
        return savedTheme;
    else {
        // saving theme as light
        localStorage.setItem("theme", "light");
        return "light";
    }
};
exports.getTheme = getTheme;
exports.default = ThemeToggle;
