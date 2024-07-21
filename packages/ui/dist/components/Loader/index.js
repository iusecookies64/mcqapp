"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_loader_spinner_1 = require("react-loader-spinner");
const Loader = ({ height = 80, width = 80, color = "#6200EE", secondaryColor = "black", }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 h-full w-full flex justify-center items-center", children: (0, jsx_runtime_1.jsx)(react_loader_spinner_1.Oval, { height: height, width: width, visible: true, color: color, secondaryColor: secondaryColor }) }));
};
exports.Loader = Loader;
