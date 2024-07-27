"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
require("./Panel.style.css");
const Panel = ({ children, isOpen, setIsOpen }) => {
    const [position, setPosition] = (0, react_1.useState)("-100%");
    const onClose = () => {
        setPosition("0%");
        setTimeout(() => {
            setIsOpen(false);
            setPosition("-100%");
        }, 200);
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "custom-panel", onClick: onClose, children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { transition: { ease: "easeOut", duration: 0.2 }, animate: { x: position }, className: "panel-container", children: children }) })) }));
};
exports.default = Panel;
