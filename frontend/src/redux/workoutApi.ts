import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { WorkoutPlan, Exercise} from './workoutSlice';

export const newWorkoutProgramApi = createApi({
    reducerPath: 'workoutApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/workouts/'}),
    endpoints: (builder) => ({
        postWorkoutPlan: builder.mutation<WorkoutPlan, WorkoutPlan>({
            query: (newPlan) => ({
            url: '/',
            method: 'POST',
            body: newPlan,
            }),
        }),
        addingExerciseToDay: builder.mutation<WorkoutPlan,  { id: string; weekNumber: number; day: string; exercise: Exercise }>({

            query: ({ id, weekNumber, day, exercise }) => ({
                url: `/${id}/weeks/${weekNumber}/days/${day}`,
                method: 'POST',
                body: exercise
            })
        }),
        deleteExerciseProgram: builder.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/${id}`,
                method: 'DELETE',
            })
        })
    }),
});

export const { usePostWorkoutPlanMutation, useAddingExerciseToDayMutation, useDeleteExerciseProgramMutation} = newWorkoutProgramApi;