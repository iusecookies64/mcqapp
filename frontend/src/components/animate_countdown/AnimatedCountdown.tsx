import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AnimatedCountdown = ({
  timeInSec,
  onComplete,
}: {
  timeInSec: number;
  onComplete: () => void;
}) => {
  const [current, setCurrent] = useState<number>(timeInSec);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev > 1) return prev - 1;
        clearInterval(timer);
        setIsFinished(true);
        setTimeout(() => onComplete(), 1000);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center">
      {!isFinished && (
        <motion.div
          className="text-[150px] font-bold opacity-0"
          animate={{ scale: 0.3, opacity: 1 }}
          transition={{ ease: "easeIn" }}
          key={current}
        >
          {current}
        </motion.div>
      )}
      {isFinished && (
        <motion.div
          className="text-[150px] font-bold opacity-0"
          animate={{ scale: 0.5, opacity: 1 }}
          transition={{ ease: "easeIn" }}
          key={"start"}
        >
          Start
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedCountdown;
