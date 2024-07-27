"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const AnimatedCountdown = ({ timeInSec, onComplete, }) => {
    const [current, setCurrent] = (0, react_1.useState)(timeInSec);
    const [isFinished, setIsFinished] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => {
                if (prev > 1)
                    return prev - 1;
                clearInterval(timer);
                setIsFinished(true);
                setTimeout(() => onComplete(), 1000);
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "w-full h-full flex-grow flex justify-center items-center", children: [!isFinished && ((0, jsx_runtime_1.jsx)("div", { className: "text-[150px] font-bold opacity-0", children: current }, current)), isFinished && ((0, jsx_runtime_1.jsx)("div", { className: "text-[150px] font-bold opacity-0", children: "Start" }, "start"))] }));
};
exports.default = AnimatedCountdown;
