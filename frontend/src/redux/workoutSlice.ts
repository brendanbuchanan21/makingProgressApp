import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface SetDetails {
  id?: string;
  setNumber: number;
  reps: number | null;
  weight: number | null;
  rir: number | null;
}

export interface Exercise {
  id?: string;
  name: string;
  muscleGroup: string;
  sets: SetDetails[];
}

export interface DayPlan {
  day: string;
  exercises: Exercise[];
  isCompleted: boolean;
  _id?: string;
}


export interface WeekPlan {
  weekNumber: number;
  days: DayPlan[];
}

export interface WorkoutPlan {
  id?: string;
  weeks: WeekPlan[];
  duration: string;
  startDate: string;
}

interface WorkoutSliceState {
  currentPlan: WorkoutPlan;
}

const initialState: WorkoutSliceState = {
    currentPlan: {
      id: '',
      weeks: [],
      duration: '',
      startDate: ''
    },
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {

    setCurrentPlan: (state, action) => {
      state.currentPlan = {
        ...action.payload,
        id: action.payload._id, // Ensure `id` is always set from `_id`
      };
    },
    resetWorkoutState: () => initialState,
  
    //action to set the plan duration
    setPlanDuration(state, action: PayloadAction<string>) {
      state.currentPlan.duration = action.payload;
    },


    // add a week for the new program to the store
    addWeek(state, action: PayloadAction<number>) {
      const newWeek: WeekPlan = { weekNumber: action.payload, days: [] };
      state.currentPlan.weeks.push(newWeek);
    },


    addExerciseToDay(state, action: PayloadAction<{ weekNumber: number; day: string; exercise: Exercise }>) {
      const { weekNumber, day, exercise } = action.payload;
      console.log("Adding exercise to day:", day);  // Debugging line
      const week = state.currentPlan.weeks.find(week => week.weekNumber === weekNumber);
      if (!week) return; // Safety check

      const dayObj = week.days.find(d => d.day === day);

    if (dayObj) {
        // Day exists, add the new exercise
        dayObj.exercises.push(exercise);
    } else {
        // Create a new day entry if it doesn't exist
        week.days.push({ day, exercises: [exercise], isCompleted: false });
    }
      
      
     
    },

    editExercise(state, action: PayloadAction<{
      weekNumber: number;
      day: string;
      exerciseId: string
      updatedExercise: Exercise
    }>) {
      const { weekNumber, day, exerciseId, updatedExercise } = action.payload;

      console.log('hmmm very curious trying to figure out:', exerciseId);
      const week = state.currentPlan.weeks.find(week => week.weekNumber === weekNumber);

      if(week) {
        const dayPlan = week.days.find(d => d.day === day);

        if(dayPlan) {
         const exerciseIndex = dayPlan.exercises.findIndex((exercise) => exercise.id === exerciseId)

         if(exerciseIndex !== -1) {
          dayPlan.exercises[exerciseIndex] = {...dayPlan.exercises[exerciseIndex], ...updatedExercise}
         }
        }

      
      }
    },

    deleteExercise(state, action: PayloadAction<{
      weekNumber: number;
      day: string;
      exerciseId: string;
    }>) {
      const { weekNumber, day, exerciseId } = action.payload;

      const week = state.currentPlan.weeks.find(week => week.weekNumber === weekNumber);

      if(!week) {
        return;
      }
      const dayPlan = week.days.find((d) => d.day === day) 

      if (!dayPlan) return;

      // Ensure exercises is always an array before filtering
      if (!dayPlan.exercises) {
          dayPlan.exercises = []; // Initialize as an empty array if it's undefined
      }
  
      dayPlan.exercises = dayPlan.exercises.filter((exercise) => exercise.id !== exerciseId);
    
    },

    addSetToExercise(state, action: PayloadAction<{
      weekNumber: number,
      day: string,
      exerciseId: string,
      newSet: SetDetails
    }>) {
      const { weekNumber, day, exerciseId, newSet } = action.payload;

      const week = state.currentPlan.weeks.find((w) => w.weekNumber === weekNumber);

      if(!week) return;

      const dayPlan = week.days.find((d) => d.day === day);
      if(!dayPlan) return;

      const exercise = dayPlan.exercises.find((e) => e.id === exerciseId);
      if(!exercise) return;

      exercise.sets.push(newSet);
    },
    removeSetFromExercise(state, action: PayloadAction<{
      weekNumber: number,
      day: string,
      exerciseId: string,
      setId: string
    }>) {
      const { weekNumber, day, exerciseId, setId } = action.payload;

      const week = state.currentPlan.weeks.find((w) => w.weekNumber === weekNumber);

      if(!week) return;

      const dayPlan = week.days.find((d) => d.day === day);
      if(!dayPlan) return;

      const exercise = dayPlan.exercises.find((e) => e.id === exerciseId);
      if(!exercise) return;

      exercise.sets = exercise.sets.filter((set) => set.id !== setId)

    },
    updateSetDetails(state, action: PayloadAction<{
      weekNumber: number | null,
      day: string,
      exerciseId: string,
      setId: string,
      updatedSet: Partial<SetDetails>
    }>) {
      const { weekNumber, day, exerciseId, setId, updatedSet } = action.payload;

      const week = state.currentPlan?.weeks.find((w) => w.weekNumber === weekNumber);
      const dayObj = week?.days.find((d) => d.day === day);
      const exercise = dayObj?.exercises.find((e) => e.id === exerciseId);
    
      if (exercise) {
        const setIndex = exercise.sets.findIndex((s) => s.id === setId);
        if (setIndex !== -1) {
          // Merge the existing set with the new values
          exercise.sets[setIndex] = { 
            ...exercise.sets[setIndex],  // Keep existing properties
            ...updatedSet               // Apply updates (e.g., weight, reps, rir)
          };
        }
      }
    },
    updateDayCompletion(state, action: PayloadAction<{
      weekNumber: number | null,
      day: string,
      isCompleted: boolean
    }>) {
      const { weekNumber, day, isCompleted } = action.payload;
      const week = state.currentPlan?.weeks.find(w => w.weekNumber === weekNumber);

      if(week) {
        const dayPlan = week.days.find(d => d.day === day);
        if(dayPlan) {
          dayPlan.isCompleted = isCompleted;
        }
      }
    }
  }
})

export const {
  setCurrentPlan,
  resetWorkoutState,
  setPlanDuration,
  addWeek,
  addExerciseToDay,
  editExercise,
  deleteExercise,
  addSetToExercise,
  removeSetFromExercise,
  updateSetDetails,
  updateDayCompletion
} = workoutSlice.actions;

export const workoutReducer = workoutSlice.reducer;
