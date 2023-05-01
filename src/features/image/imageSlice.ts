import { createSlice } from "@reduxjs/toolkit";

export const imageSlice = createSlice({
  name: "image",
  initialState: {
    value: "",
  },
  reducers: {
    setImage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setImage } = imageSlice.actions;

export default imageSlice.reducer;
