import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";

const store = configureStore({
  reducer: {
    workout: workoutReducer, // Include the workout slice reducer
  },
  devTools: process.env.NODE_ENV !== 'production', // This enables Redux DevTools
});


export type RootState = ReturnType<typeof store.getState>;
export default store;