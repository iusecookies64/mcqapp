import { useState } from "react";
import "./PlayOptions.style.css";

const PlayOptions = () => {
  const [activeBanner, setActiveBanner] = useState(1);
  return (
    <div className="w-full h-full flex justify-center items-center gap-16">
      <div className="w-full h-[80%] max-w-2xl flex items-center">
        {activeBanner === 1 && (
          <div className="animate-enter-from-right text-3xl">
            Play against random players <br /> and show off your knowledge
          </div>
        )}
        {activeBanner === 2 && (
          <div className="animate-enter-from-right text-3xl">
            Play with your friends <br /> and learn together.
          </div>
        )}
        {activeBanner === 3 && (
          <div className="animate-enter-from-right text-3xl">
            Create a game of your own <br />
            and challenge your friends to play
          </div>
        )}
      </div>
      <div className="flex flex-col gap-8 h-[80%] justify-center">
        <div
          className="play-game-button bg-purple-600 shadow-big-button shadow-purple-900 hover:bg-purple-500"
          onMouseMove={() => setActiveBanner(1)}
        >
          Play vs Random
        </div>
        <div
          className="play-game-button bg-blue-600 shadow-big-button shadow-blue-900 hover:bg-blue-500"
          onMouseMove={() => setActiveBanner(2)}
        >
          Play vs Friends
        </div>
        <div
          className="play-game-button bg-slate-400 hover:bg-slate-300 dark:bg-slate-600 shadow-big-button shadow-slate-500 dark:shadow-slate-800 dark:hover:bg-slate-500"
          onMouseMove={() => setActiveBanner(3)}
        >
          Create Custom Game
        </div>
      </div>
    </div>
  );
};

export default PlayOptions;
