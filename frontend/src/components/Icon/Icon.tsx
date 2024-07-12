import { FaCheck, FaExclamation, FaPen, FaPlus } from "react-icons/fa";
import { FaGear, FaTrashCan, FaXmark } from "react-icons/fa6";
import { IoExit, IoInformationOutline } from "react-icons/io5";
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
}

type Props = {
  icon: IconList;
  className?: string;
};

export const Icon = ({ icon, className }: Props) => {
  return (
    <>
      {icon === IconList.plus && <FaPlus className={className} />}
      {icon === IconList.gear && <FaGear className={className} />}
      {icon === IconList.exit && <IoExit className={className} />}
      {icon === IconList.xmark && <FaXmark className={className} />}
      {icon === IconList.error && <FaExclamation className={className} />}
      {icon === IconList.info && <IoInformationOutline className={className} />}
      {icon === IconList.pen && <FaPen className={className} />}
      {icon === IconList.trash && <FaTrashCan className={className} />}
      {icon === IconList.check && <FaCheck className={className} />}
      {icon === IconList.grip && <TbGripVertical className={className} />}
    </>
  );
};
