import "./Icon.style.css";

export enum IconList {
  plus = "fa-solid fa-plus",
  bell = "fa-solid fa-bell",
  gear = "fa-solid fa-gear",
  exit = "fa-solid fa-right-from-bracket",
}

type Props = {
  icon: IconList;
  toolTip?: string;
  onClick?: (event: React.MouseEvent) => void;
};

export const Icon = ({ icon, toolTip, onClick }: Props) => {
  return (
    <div
      className="icon-container"
      data-tooltip-id="my-tooltip"
      data-tooltip-content={toolTip}
      onClick={onClick}
    >
      <i className={`${icon} icon-style`}></i>
    </div>
  );
};
