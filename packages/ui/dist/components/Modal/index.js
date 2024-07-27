"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Modal.style.css");
const Icon_1 = require("../Icon");
const framer_motion_1 = require("framer-motion");
const Modal = ({ children, isOpen, setIsOpen }) => {
    const [opacity, setOpacity] = (0, react_1.useState)(1);
    const [scale, setScale] = (0, react_1.useState)(1.1);
    const onClose = () => {
        setOpacity(0);
        setScale(1);
        setTimeout(() => {
            setIsOpen(false);
            setOpacity(1);
            setScale(1.1);
        }, 150);
    };
    if (typeof children === "function") {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "custom-modal", onClick: onClose, children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { animate: { opacity, scale }, transition: { duration: 0.2 }, className: "modal-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 flex justify-end p-2 cursor-pointer", onClick: onClose, children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: Icon_1.IconList.xmark }) }), children(onClose)] }) })) }));
    }
    else {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: isOpen && ((0, jsx_runtime_1.jsx)("div", { className: "custom-modal", onClick: onClose, children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { animate: { opacity, scale }, transition: { duration: 0.2 }, className: "modal-container", onClick: (e) => e.stopPropagation(), children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 right-0 flex justify-end p-3 cursor-pointer", onClick: onClose, children: (0, jsx_runtime_1.jsx)(Icon_1.Icon, { icon: Icon_1.IconList.xmark }) }), children] }) })) }));
    }
};
exports.default = Modal;
