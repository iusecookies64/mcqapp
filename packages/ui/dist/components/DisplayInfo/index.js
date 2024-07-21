"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayInfo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Icon_1 = require("../Icon");
const DisplayInfo = ({ message, type }) => {
    return ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 h-full w-full flex justify-center items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 items-center ", children: [type === "error" && ((0, jsx_runtime_1.jsx)("div", { className: "h-24 w-24 flex justify-center items-center rounded-[50%] bg-red text-5xl", children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: Icon_1.IconList.error }) })), type === "info" && ((0, jsx_runtime_1.jsx)("div", { className: "h-24 w-24 flex justify-center items-center rounded-[50%] bg-sky-600 text-5xl", children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: Icon_1.IconList.info }) })), (0, jsx_runtime_1.jsx)("div", { className: "font-medium", children: message })] }) }));
};
exports.DisplayInfo = DisplayInfo;
