"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Button.style.css");
const Button = ({ variant = "primary", size = "md", onClick, children, className, tooltip = "", type, }) => {
    return ((0, jsx_runtime_1.jsx)("button", { className: `custom-button button-${variant} button-${size} ${className}`, onClick: onClick, type: type, "data-tooltip-id": "my-tooltip", "data-tooltip-content": tooltip, children: children }));
};
exports.default = Button;
