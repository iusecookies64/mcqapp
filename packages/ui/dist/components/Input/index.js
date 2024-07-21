"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
require("./input.style.css");
const Input = ({ inputLabel, register, error, errorMessage, onChange, inputType, className = "", placeholder = "", defaultValue, value = "", }) => {
    if (register) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "custom-input", children: [inputLabel && (0, jsx_runtime_1.jsx)("label", { children: inputLabel }), (0, jsx_runtime_1.jsx)("input", Object.assign({ "aria-label": inputLabel, defaultValue: defaultValue || "", className: className }, register, { type: inputType, placeholder: placeholder })), error && ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-light-red", children: errorMessage }))] }));
    }
    else {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "custom-input", children: [inputLabel && (0, jsx_runtime_1.jsx)("label", { children: inputLabel }), (0, jsx_runtime_1.jsx)("input", { value: value, className: className, type: inputType, placeholder: placeholder, onChange: onChange }), error && ((0, jsx_runtime_1.jsx)("span", { className: "text-sm text-light-red", children: errorMessage }))] }));
    }
};
exports.Input = Input;
