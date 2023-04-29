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
      className="h-32 w-32 rounded-sm text-2xl font-semibold capitalize text-slate-200 dark:text-slate-200  drop mx-2 border border-slate-300 dark:border-slate-500 bg-slate-500 dark:bg-slate-800 shadow-2xl hover:bg-slate-700"
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
    <div className="flex flex-wrap justify-between gap-2 pb-4">
      {filters.map((filterName) => {
        return <FilterButton name={filterName} key={filterName} />;
      })}
    </div>
  );
};

export default FilterSelection;
