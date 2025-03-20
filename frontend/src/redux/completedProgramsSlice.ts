import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeekPlan } from "./workoutSlice";

export interface CompletedProgram {
    userId: string;
    _id: string;
    //the weekplan could be an issue down the line
    weeks: WeekPlan;
    duration: string;
    startDate: string;
}

const initialState = {
    completed: [] as CompletedProgram[]
}

const completedProgramsSlice = createSlice({
    name: 'completedPrograms',
    initialState,
    reducers: {
        setCompletedPrograms: (state, action: PayloadAction<CompletedProgram[]>) => {
            state.completed = action.payload; // replace entire array
        },
        addCompletedProgram: (state, action: PayloadAction<CompletedProgram>) => {
            state.completed.push(action.payload)
        },
        removeCompletedPrograms: (state) => {
            state.completed = []
        }
    }
})


export const {
    setCompletedPrograms,
    addCompletedProgram,
    removeCompletedPrograms
} = completedProgramsSlice.actions;

export const completedWorkoutProgramsReducer = completedProgramsSlice.reducer;