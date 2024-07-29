import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaExclamation,
  FaPen,
  FaPlus,
} from "react-icons/fa";
import { FaGear, FaTrashCan, FaXmark } from "react-icons/fa6";
import { FiMoon } from "react-icons/fi";
import { IoMdExit, IoMdSunny } from "react-icons/io";
import { IoInformationOutline } from "react-icons/io5";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { TbGripVertical } from "react-icons/tb";

export enum IconList {
  plus,
  gear,
  exit,
  xmark,
  error,
  pen,
  trash,
  check,
  info,
  grip,
  sun,
  moon,
  chevrondown,
  chevronup,
  search,
}

type Props = {
  icon: IconList;
  className?: string;
};

export const Icon = ({ icon, className }: Props) => {
  return (
    <>
      {icon === IconList.plus && (
        <FaPlus className={`${className} dark:text-white`} />
      )}
      {icon === IconList.gear && (
        <FaGear className={`${className} dark:text-white`} />
      )}
      {icon === IconList.exit && (
        <IoMdExit className={`${className} dark:text-white`} />
      )}
      {icon === IconList.xmark && (
        <FaXmark className={`${className} dark:text-white`} />
      )}
      {icon === IconList.error && (
        <FaExclamation className={`${className} dark:text-white`} />
      )}
      {icon === IconList.info && (
        <IoInformationOutline className={`${className} dark:text-white`} />
      )}
      {icon === IconList.pen && (
        <FaPen className={`${className} dark:text-white`} />
      )}
      {icon === IconList.trash && (
        <FaTrashCan className={`${className} fill-white`} />
      )}
      {icon === IconList.check && (
        <FaCheck className={`${className} dark:text-white`} />
      )}
      {icon === IconList.grip && (
        <TbGripVertical className={`${className} dark:text-white`} />
      )}
      {icon === IconList.sun && (
        <IoMdSunny className={`${className} dark:text-yellow`} />
      )}
      {icon === IconList.moon && (
        <FiMoon className={`${className} dark:text-white`} />
      )}
      {icon === IconList.chevrondown && (
        <FaChevronDown className={`${className} dark:text-white`} />
      )}
      {icon === IconList.chevronup && (
        <FaChevronUp className={`${className} dark:text-white`} />
      )}
      {icon === IconList.search && (
        <HiMiniMagnifyingGlass className={`${className} dark:text-white`} />
      )}
    </>
  );
};

export default Icon;
