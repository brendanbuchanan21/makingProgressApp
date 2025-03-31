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
      isComplete?: boolean;
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
        },
        deletingSetFromExercise(state, action: PayloadAction<{exerciseId: string, setId: string}>) {
            const { exerciseId, setId } = action.payload;
            const exercise = state.quickWorkout.exercises.find((exercise) => exercise.id === exerciseId);

            if(exercise) {
                exercise.sets = exercise?.sets.filter((set) => set.id !== setId);
            }
           

        },
        updateSetDetails(state, action: PayloadAction<{
            exerciseId: string,
            setId: string,
            updatedSet: Partial<Pick<noPlanSet, "weight" | "reps" | "rir">>,
        }>) {
            const { exerciseId, setId, updatedSet } = action.payload;
           
                const exercise = state.quickWorkout.exercises.find((exercise) => exercise.id === exerciseId)
                if(exercise) {
                    const set = exercise.sets.find((set) => set.id === setId);

                    if (set) {
                        Object.assign(set, updatedSet); // Merge the partial update into the existing set
                    }
                }
            },
            deletingExercise(state, action: PayloadAction<{exerciseId: string}>) {
                const { exerciseId } = action.payload;
                
                    state.quickWorkout.exercises = state.quickWorkout.exercises.filter((exercise) => exercise.id !== exerciseId);
                
            },
            exerciseComplete(state, action: PayloadAction<{exerciseId: string}>) {
                const { exerciseId } = action.payload;

                const exercise = state.quickWorkout.exercises.find((exercise) => exercise.id === exerciseId);

                if(exercise) {
                    exercise.isComplete = !exercise.isComplete;
                }
            },
            resetQuickWorkout(state){
                return initialState;
            }
        },
    })

export const quickWorkoutReducer = quickWorkoutSlice.reducer;

export const {
    addExercise,
    addingSetToExercise,
    deletingSetFromExercise,
    updateSetDetails,
    deletingExercise,
    exerciseComplete,
    resetQuickWorkout,
} = quickWorkoutSlice.actions;