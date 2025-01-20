import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface Exercise {
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

interface WorkoutPlan {
  weeks: WeekPlan[];
  duration: string;
}

interface WorkoutSliceState {
  currentPlan: WorkoutPlan;
}

const initialState: WorkoutSliceState = {
    currentPlan: {
      weeks: [],
      duration: '',
    },
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {

    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
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

      const week = state.currentPlan.weeks.find(week => week.weekNumber === weekNumber);
      console.log('Found week:', week);
      if(week) { 
        const dayIndex = week.days.findIndex(d => d.day === day); 
       
        if (dayIndex !== -1) {
          // If day is found, add the exercise
          const dayPlan = week.days[dayIndex];
          console.log('Adding exercise to existing day:', dayPlan);
    
          
      // Ensure exercises array exists
        if (!dayPlan.exercises) {
           dayPlan.exercises = []; // Initialize exercises array if undefined
      }

      // Add the exercise to the dayPlan's exercises
        dayPlan.exercises.push(exercise);
        } else {
          // If the day doesn't exist, create it and add the exercise
          console.log(`Adding new day: ${day} with exercise: ${exercise.name}`);
          week.days.push({ day, exercises: [exercise] });
        }


        if(weekNumber === 1) {
          const firstWeekDays = state.currentPlan.weeks.find(w => w.weekNumber === 1)?.days;

          if(firstWeekDays) {
            
            state.currentPlan.weeks.forEach(w => {

              if(w.weekNumber !== 1) {

                w.days = firstWeekDays.map(firstWeekDay => ({
                  day: firstWeekDay.day,
                  exercises: [...firstWeekDay.exercises],
                }));
              }
            });
          }
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
      exerciseIndex: number;
    }>) {
      const { weekNumber, day, exerciseIndex } = action.payload;

      const week = state.currentPlan.weeks.find(week => week.weekNumber === weekNumber);

      if(week) {
        const dayPlan = week.days.find(d => d.day === day);

        if(dayPlan && dayPlan.exercises[exerciseIndex]) {
          // update the specific exercise
          dayPlan.exercises.splice(exerciseIndex, 1);
        }
      }
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
