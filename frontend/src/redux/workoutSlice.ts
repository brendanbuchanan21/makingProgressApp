import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Exercise {
  id?: string;
  name: string;
  muscleGroup: string;
  sets: number;
  repsInReserve: number;
}

export interface DayPlan {
  day: string;
  exercises: Exercise[];
}


export interface WeekPlan {
  weekNumber: number;
  days: DayPlan[];
}

export interface WorkoutPlan {
  id?: string;
  weeks: WeekPlan[];
  duration: string;
}

interface WorkoutSliceState {
  currentPlan: WorkoutPlan;
}

const initialState: WorkoutSliceState = {
    currentPlan: {
      id: '',
      weeks: [],
      duration: '',
      // so i store the plansId here???
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
      if(week) { 
        const dayIndex = week.days.findIndex(d => d.day === day); 
       
        if (dayIndex !== -1) {
          // If day is found, add the exercise
          const dayPlan = week.days[dayIndex];
    
          
      // Ensure exercises array exists
        if (!dayPlan.exercises) {
           dayPlan.exercises = []; // Initialize exercises array if undefined
      }

      // Add the exercise to the dayPlan's exercises
        dayPlan.exercises.push(exercise);
        } else {
          // If the day doesn't exist, create it and add the exercise
          week.days.push({ day, exercises: [exercise] });
        }

      }
    },

    editExercise(state, action: PayloadAction<{
      weekNumber: number;
      day: string;
      exerciseIndex: number;
      updatedExercise: Exercise
    }>) {
      const { weekNumber, day, exerciseIndex, updatedExercise } = action.payload;

      const week = state.currentPlan.weeks.find(week => week.weekNumber === weekNumber);

      if(week) {
        const dayPlan = week.days.find(d => d.day === day);

        if(dayPlan && dayPlan.exercises[exerciseIndex]) {
          // update the specific exercise
          dayPlan.exercises[exerciseIndex] = updatedExercise;
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
    
    }



  }
})

export const {
  setCurrentPlan,
  setPlanDuration,
  addWeek,
  addExerciseToDay,
  editExercise,
  deleteExercise
} = workoutSlice.actions;

export const workoutReducer = workoutSlice.reducer;
