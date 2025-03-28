import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface noPlanSet {
   id: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  rir: number | null;
}

export interface noPlanExercise {
      id: string;
      name: string;
      muscleGroup: string;
      sets: noPlanSet[];
}



export interface noPlanWorkout {
    dateDone: string;
    exercises: noPlanExercise[];
}

interface noPlanSliceState {
    quickWorkout: noPlanWorkout;
}


const initialState: noPlanSliceState = {
    quickWorkout: {
        dateDone: '',
        exercises: [],

    },
};


const quickWorkoutSlice = createSlice({
    name: 'quickWorkout',
    initialState,
    reducers: {
        addExercise(state, action: PayloadAction<noPlanExercise>) {
            state.quickWorkout.exercises.push(action.payload);
        },
        addingSetToExercise(state, action: PayloadAction<{exerciseId: string, newSet: noPlanSet}>) {
            const { exerciseId, newSet } = action.payload;
            const exercise = state.quickWorkout.exercises.find((exercise) => exercise.id === exerciseId);
            if(exercise) {
                exercise.sets.push(newSet);
            }
        }
    },
})

export const quickWorkoutReducer = quickWorkoutSlice.reducer;

export const {
    addExercise
} = quickWorkoutSlice.actions;