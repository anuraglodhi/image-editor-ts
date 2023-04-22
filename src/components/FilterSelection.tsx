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
      className="h-32 w-32 bg-slate-600 capitalize"
      onClick={() => dispatch(applyFilter(name))}
    >
      {name}
    </button>
  );
};

const FilterSelection = () => {
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {filters.map((filterName) => {
        return <FilterButton name={filterName} key={filterName} />;
      })}
    </div>
  );
};

export default FilterSelection;
