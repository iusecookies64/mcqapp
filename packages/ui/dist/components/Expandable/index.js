"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expandable = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const Button_1 = require("../Button");
const Icon_1 = require("../Icon");
const react_1 = require("react");
const Expandable = ({ children }) => {
    const [isExpanded, setIsExpanded] = (0, react_1.useState)(false);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative pb-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "overflow-hidden h-0", animate: isExpanded ? { height: "auto" } : { height: "0" }, children: children }), (0, jsx_runtime_1.jsx)(Button_1.Button, { className: "absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 z-10", type: "button", variant: "secondary", size: "sm", onClick: () => setIsExpanded((isExpanded) => !isExpanded), children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: isExpanded ? Icon_1.IconList.chevronup : Icon_1.IconList.chevrondown }) })] }));
};
exports.Expandable = Expandable;
