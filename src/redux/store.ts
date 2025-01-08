import { configureStore } from "@reduxjs/toolkit";
import { workoutReducer } from './workoutSlice';

const store = configureStore({
    reducer: {
      workout: workoutReducer, // This will be your slice for workout-related data
    },
  });

  export default store;