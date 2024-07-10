export enum IconList {
  plus = "fa-solid fa-plus",
  bell = "fa-solid fa-bell",
  gear = "fa-solid fa-gear",
  exit = "fa-solid fa-right-from-bracket",
  xmark = "fa-solid fa-xmark",
  error = "fa-solid fa-exclamation",
  pen = "fa-solid fa-pen",
  trash = "fa-solid fa-trash",
  check = "fa-solid fa-check",
}

type Props = {
  icon: IconList;
  className?: string;
};

export const Icon = ({ icon, className }: Props) => {
  return <i className={`${icon} ${className}`}></i>;
};
