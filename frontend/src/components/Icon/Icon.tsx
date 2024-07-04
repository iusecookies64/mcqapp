import "./Icon.style.css";

export enum IconList {
  plus = "fa-solid fa-plus",
  bell = "fa-solid fa-bell",
  gear = "fa-solid fa-gear",
  exit = "fa-solid fa-right-from-bracket",
  xmark = "fa-solid fa-xmark",
  error = "fa-solid fa-exclamation",
  pen = "fa-solid fa-pen",
  trash = "fa-solid fa-trash",
}

type Props = {
  icon: IconList;
  toolTip?: string;
  onClick?: (event: React.MouseEvent) => void;
  variant?: "primary" | "secondary" | "large" | "small" | "xsmall";
  className?: string;
};

export const Icon = ({
  icon,
  toolTip,
  onClick,
  variant = "primary",
  className = "",
}: Props) => {
  return (
    <div
      className={`icon-container-${variant} ${className}`}
      data-tooltip-id="my-tooltip"
      data-tooltip-content={toolTip}
      onClick={onClick}
    >
      <i className={`${icon} icon-style`}></i>
    </div>
  );
};
