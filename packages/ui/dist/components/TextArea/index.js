"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./textarea.style.css");
const Textarea = ({ inputLabel, register, error, errorMessage, onChange, className = "", placeholder = "", defaultValue, value = "", }) => {
    const dynamicHeight = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };
    const initializeHeight = (element) => {
        element.style.height = "auto";
        element.style.height = `${element.scrollHeight}px`;
    };
    (0, react_1.useEffect)(() => {
        document.querySelectorAll("textarea").forEach((textarea) => {
            initializeHeight(textarea);
        });
    }, []);
    if (register) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "custom-textarea", children: [inputLabel && (0, jsx_runtime_1.jsx)("label", { children: inputLabel }), (0, jsx_runtime_1.jsx)("textarea", Object.assign({ "aria-label": inputLabel, defaultValue: defaultValue || "", className: className }, register, { placeholder: placeholder, onInput: (e) => dynamicHeight(e), rows: 1 })), error && (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-500", children: errorMessage })] }));
    }
    else {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "custom-textarea", children: [inputLabel && (0, jsx_runtime_1.jsx)("label", { children: inputLabel }), (0, jsx_runtime_1.jsx)("textarea", { value: value, className: className, placeholder: placeholder, onChange: onChange, rows: 1 }), error && (0, jsx_runtime_1.jsx)("span", { className: "text-sm text-red-500", children: errorMessage })] }));
    }
};
exports.default = Textarea;
