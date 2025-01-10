import { createSlice, PayloadAction } from "@reduxjs/toolkit";


// Define the type for a workout plan
interface WorkoutPlan {
    days: string[];
    duration: string;
  }
  
  // Define the initial state type
  interface WorkoutState {
    plans: WorkoutPlan[]; // Array of workout plans
    currentPlan: WorkoutPlan | null; // Currently selected workout plan
  }
  
  // Initial state
  const initialState: WorkoutState = {
    plans: [],
    currentPlan: null,
  };

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    setCurrentPlan(state, action: PayloadAction<WorkoutPlan>) {
        state.currentPlan = action.payload;
    },
   
  },
});

export const { setCurrentPlan } = workoutSlice.actions;
export const workoutReducer = workoutSlice.reducer;
