import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { WorkoutPlan, Exercise, WeekPlan} from './workoutSlice';


interface DeleteExerciseRequest {
    workoutId: string,
    exerciseId: string,
    weekNumber: number | string,
    day: string | number,

}

interface editExerciseRequest {
    workoutId: string, 
    exerciseId: string, 
    weekNumber: number | string,
    day: string | number,
    updatedExercise: Exercise
}

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
        addingExerciseToDay: builder.mutation<Exercise | any,  { id: string; weekNumber: number; day: string; exercise: Exercise }>({

            query: ({ id, weekNumber, day, exercise }) => ({
                url: `/${id}/weeks/${weekNumber}/days/${day}`,
                method: 'POST',
                body: exercise
            }),
        }),
        deleteExerciseProgram: builder.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/${id}`,
                method: 'DELETE',
            })
        }),
        getExerciseProgram: builder.query<WorkoutPlan, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            })
        }),
        deleteExerciseApi: builder.mutation<DeleteExerciseRequest, DeleteExerciseRequest>({
            query: ({workoutId, exerciseId, weekNumber, day}) => ({
                url: `/${workoutId}/weeks/${weekNumber}/days/${day}/${exerciseId}`,
                method: "DELETE"
            })
        }),
        editExerciseApi: builder.mutation<void, editExerciseRequest>({
            query: ({ workoutId, weekNumber, day, exerciseId, updatedExercise }) => ({
                url: `/${workoutId}/weeks/${weekNumber}/days/${day}/${exerciseId}`,
                method: "PATCH",
                body: updatedExercise
            })
        })
    }),
});

export const { usePostWorkoutPlanMutation, useAddingExerciseToDayMutation, useDeleteExerciseProgramMutation, useGetExerciseProgramQuery, useDeleteExerciseApiMutation, useEditExerciseApiMutation} = newWorkoutProgramApi;