import "./Tabs.style.css";
type Props = {
    tabs: {
        title: string;
        value: string;
    }[];
    activeTab: string;
    setActiveTab: (value: string) => void;
};
export declare const Tabs: ({ tabs, activeTab, setActiveTab }: Props) => import("react/jsx-runtime").JSX.Element;
export {};
