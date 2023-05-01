import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filter/filterSlice";
import imageReducer from "../features/image/imageSlice";

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        image: imageReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;