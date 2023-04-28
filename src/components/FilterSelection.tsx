import React from "react";
import { useDispatch } from "react-redux";
import { applyFilter } from "../features/filter/filterSlice";
import Filters from "../common/filters";

const filters = Object.getOwnPropertyNames(Filters);

interface FilterButtonProps {
  name: string;
}
const FilterButton = ({ name }: FilterButtonProps) => {
  const dispatch = useDispatch();

  return (
    <button
      className="h-32 w-32 rounded-sm bg-slate-500 text-2xl font-semibold capitalize text-slate-200"
      onClick={() => {
        dispatch(applyFilter(name));
      }}
    >
      {name}
    </button>
  );
};

const FilterSelection = () => {
  return (
    <div className="flex flex-wrap justify-around gap-2 pb-4">
      {filters.map((filterName) => {
        return <FilterButton name={filterName} key={filterName} />;
      })}
    </div>
  );
};

export default FilterSelection;
