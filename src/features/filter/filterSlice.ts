import { createSlice } from "@reduxjs/toolkit";
import Konva from "konva";

export interface FilterState {
  filters: any;
  blurRadius?: number;
  noise?: number;
}

const initialState: FilterState = {
  filters: [],
  blurRadius: 0,
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    applyFilter: (state) => {
      (state.filters = [
        Konva.Filters.Blur,
        Konva.Filters.Sepia,
        Konva.Filters.Noise,
      ]),
        (state.blurRadius = 1),
        (state.noise = 0.1);
    },
    clearFilter: (state) => {
      (state.filters = []), (state.blurRadius = 0), (state.noise = 0);
    },
  },
});

export const { applyFilter, clearFilter } = filterSlice.actions;

export default filterSlice.reducer;
