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
        className="h-16 w-full border-b-2 hover:bg-slate-200 active:bg-slate-300"
        onClick={() => onClick(toolName)}
      >
        {children}
      </button>
    </>
  );
};

export default Tool;
