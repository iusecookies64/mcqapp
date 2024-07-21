import { useEffect, useState } from "react";

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
    <div className="w-full h-full flex-grow flex justify-center items-center">
      {!isFinished && (
        <div className="text-[150px] font-bold opacity-0" key={current}>
          {current}
        </div>
      )}
      {isFinished && (
        <div className="text-[150px] font-bold opacity-0" key={"start"}>
          Start
        </div>
      )}
    </div>
  );
};

export default AnimatedCountdown;
