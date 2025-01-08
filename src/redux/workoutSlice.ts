import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface workoutState {
    workoutDays: string[];
    programDuration: string;
}

const initialState: workoutState = {
    workoutDays: [],
    programDuration: '',
  };


  const workoutSlice = createSlice({
    name: 'workout',
  initialState,
  reducers: {
    setWorkoutDays(state, action: PayloadAction<string[]>) {
      state.workoutDays = action.payload;
    },
    setProgramDuration(state, action: PayloadAction<string>) {
      state.programDuration = action.payload;
    },
  },
  });


  export const { setWorkoutDays, setProgramDuration } = workoutSlice.actions;

// Export the reducer to use in the store
export default workoutSlice.reducer;