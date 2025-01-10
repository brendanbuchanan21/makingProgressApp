import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";

const store = configureStore({
  reducer: {
    workout: workoutReducer, // Include the workout slice reducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export default store;