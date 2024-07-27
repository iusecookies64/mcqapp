export declare enum IconList {
    plus = 0,
    gear = 1,
    exit = 2,
    xmark = 3,
    error = 4,
    pen = 5,
    trash = 6,
    check = 7,
    info = 8,
    grip = 9,
    sun = 10,
    moon = 11,
    chevrondown = 12,
    chevronup = 13
}
type Props = {
    icon: IconList;
    className?: string;
};
export declare const Icon: ({ icon, className }: Props) => import("react/jsx-runtime").JSX.Element;
export default Icon;
