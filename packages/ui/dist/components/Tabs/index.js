"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tabs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
require("./Tabs.style.css");
const react_1 = require("react");
const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    const [animationState, setAnimationBoxState] = (0, react_1.useState)({
        x: 0,
        width: 0,
        height: 0,
    });
    (0, react_1.useEffect)(() => {
        var _a, _b;
        const parentRect = (_a = document
            .getElementById("ui-tabs")) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        const rect = (_b = document.getElementById(activeTab)) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
        if (!rect || !parentRect)
            return;
        const xPos = (rect === null || rect === void 0 ? void 0 : rect.x) - (parentRect === null || parentRect === void 0 ? void 0 : parentRect.x);
        const width = rect.width;
        const height = parentRect.height;
        setAnimationBoxState({
            x: xPos,
            width: width,
            height: height,
        });
    }, [activeTab]);
    return ((0, jsx_runtime_1.jsxs)("div", { id: "ui-tabs", className: "tabs-container", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-0 left-0 w-full h-full z-[0]", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: animationState, transition: { ease: "easeOut", duration: 0.2 }, className: "bg-primary dark:bg-purple rounded z-[0]" }) }), (0, jsx_runtime_1.jsx)("div", { className: "tabs", children: tabs.map((tab, indx) => ((0, jsx_runtime_1.jsx)("div", { className: activeTab === tab.value ? "active-tab" : "", id: tab.value, onClick: () => setActiveTab(tab.value), children: tab.title }, indx))) })] }));
};
exports.Tabs = Tabs;
