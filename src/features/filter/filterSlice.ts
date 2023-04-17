import { createSlice } from "@reduxjs/toolkit";
import Konva from "konva";


export interface FilterState {
  filters: any,
  blurRadius?: number;
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
      (state.filters = [Konva.Filters.Blur], (state.blurRadius = 10));
    },
  },
});

export const { applyFilter } = filterSlice.actions;

export default filterSlice.reducer;
