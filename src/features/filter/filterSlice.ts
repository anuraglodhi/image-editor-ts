import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Filters from "../../common/filters";
import Konva from "konva";
import { Filter } from "konva/lib/Node";

export interface FilterState {
  filters: Filter[];
  blurRadius?: number;
  noise?: number;
  contrast?: number;
  saturation?: number;
}

const initialState: { value: FilterState } = {
  value: {
    filters: [],
    blurRadius: 0,
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    applyFilter: (state, action: PayloadAction<string>) => {
      /** @ts-expect-error */
      state.value = Filters[action.payload];
    },
  },
});

export const { applyFilter  } = filterSlice.actions;

export default filterSlice.reducer;
