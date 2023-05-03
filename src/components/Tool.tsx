import React from "react";

const Tool = ({
  toolName,
  onClick,
  icon,
  children,
}: {
  toolName: string;
  onClick: (toolName: string) => void;
  icon: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button
        className="h-16 w-[95%] flex justify-center items-center px-0.5 rounded-sm border-b-2 border-slate-500 dark:border-slate-200 font-semibold text-slate-600 dark:text-slate-200 text-[20px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600"
        onClick={() => onClick(toolName)}
        >
        <img src={icon} className="h-6 mx-0.5" />
        {children}
      </button>
    </>
  );
};

export default Tool;
