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
      className="text-md aspect-square w-full rounded-sm border-b-2 border-slate-300 dark:border-slate-200 bg-slate-500 dark:bg-slate-800 font-semibold capitalize text-slate-300 dark:text-slate-200 hover:bg-slate-600 dark:hover:bg-slate-700 active:bg-slate-500 dark:active:bg-slate-600 md:text-2xl"
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
    <div className="grid grid-cols-2 place-items-center gap-2 px-2">
      {filters.map((filterName) => {
        return <FilterButton name={filterName} key={filterName} />;
      })}
    </div>
  );
};

export default FilterSelection;
