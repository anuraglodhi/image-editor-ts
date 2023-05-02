import React from "react";

const Tool = ({
  toolName,
  onClick,
  children,
}: {
  toolName: string;
  onClick: (toolName: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <>
      <button
        className="h-16 w-[95%] flex flex-col justify-center items-center rounded-sm border-b-2 border-slate-500 dark:border-slate-200 font-semibold text-slate-600 dark:text-slate-200 text-[24px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-500"
        onClick={() => onClick(toolName)}
      >
        {children}
      </button>
    </>
  );
};

export default Tool;
