import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";
import { newWorkoutProgramApi } from "./workoutApi";

const store = configureStore({
  reducer: {
    workout: workoutReducer, // Include the workout slice reducer
    [newWorkoutProgramApi.reducerPath]: newWorkoutProgramApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware().concat(newWorkoutProgramApi.middleware),
  devTools: process.env.NODE_ENV !== 'production', // This enables Redux DevTools
});


export type RootState = ReturnType<typeof store.getState>;
export default store;