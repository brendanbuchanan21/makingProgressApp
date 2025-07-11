import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { WorkoutPlan, Exercise, SetDetails} from './workoutSlice';
import { getAuth } from 'firebase/auth';

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

interface addSetToExerciseRequest {
    workoutId: string;
    weekNumber: number;
    day: string;
    exerciseId: string;
    newSet: SetDetails;
}

interface addSetResponse {
    newSet: {
        _id: string; // Add the id property
        setNumber: number;
        reps: number | null;
        weight: number | null;
        rir: number | null;
        }
}

interface deleteSetRequest {
    workoutId: string,
    exerciseId: string,
    weekNumber: number | string,
    day: string | number,
    setId: string
}

interface dayCompletionRequest {
    workoutPlanId: string, 
    weekNumber: number,
    day: string, 
    isCompleted: boolean
}

interface deleteWeekRequest {
    workoutPlanId: string,
    weekNumber: number
}
interface addWeekRequest {
    workoutPlanId: string,
    weekNumber: number,
    days?: {day: string, exercises: any[] }[];
}


export const newWorkoutProgramApi = createApi({
    reducerPath: 'workoutApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/workouts`, prepareHeaders: async (headers) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) {
            const token = await user.getIdToken();
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            console.log("❌ No user authenticated");
        }
        return headers;
    }}),
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
        getExerciseProgram: builder.query<WorkoutPlan, { workoutPlanId: string }>({
            query: ({workoutPlanId}) => ({
                url: `/${workoutPlanId}`,
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
        }),
        addSetToExerciseApi: builder.mutation<addSetResponse, addSetToExerciseRequest>({
            query: ({ workoutId, weekNumber, day, exerciseId, newSet }) => ({
                url: `/${workoutId}/weeks/${weekNumber}/days/${day}/${exerciseId}/sets`,
                method: "POST",
                body: { newSet } 
            })
        }),
        deleteSetFromExerciseApi: builder.mutation<void, deleteSetRequest>({
            query: ({workoutId, weekNumber, day, exerciseId, setId }) => ({
                url: `/${workoutId}/weeks/${weekNumber}/days/${day}/${exerciseId}/sets/${setId}`,
                method: "DELETE",
            })
        }),
        updateWorkoutCompletionApi: builder.mutation<WorkoutPlan, dayCompletionRequest>({
            query: ({ workoutPlanId, weekNumber, day, isCompleted }) => ({
                url: `/${workoutPlanId}/weeks/${weekNumber}/days/${day}`,
                method: "PATCH",
                body: { isCompleted }
            })
        }),
        deleteWeekApi: builder.mutation<void, deleteWeekRequest>({
            query: ({ workoutPlanId, weekNumber }) => ({
                url: `/${workoutPlanId}/weeks/${weekNumber}`,
                method: "DELETE"
            })
        }),
        handleAddWeekApi: builder.mutation<WorkoutPlan, addWeekRequest>({
            query: ({workoutPlanId, weekNumber, days}) => ({
                url: `/${workoutPlanId}/weeks`,
                method: "PATCH",
                body: {weekNumber, days}
            })
        }),
        duplicateFirstWeekApi: builder.mutation<WorkoutPlan, WorkoutPlan>({
            query: (updatedWorkoutPlan) => ({
                url: `/${updatedWorkoutPlan._id}`,
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: updatedWorkoutPlan,  
            })
        })
    }),
});

export const { useDuplicateFirstWeekApiMutation, usePostWorkoutPlanMutation, useUpdateWorkoutCompletionApiMutation, useAddingExerciseToDayMutation, useDeleteExerciseProgramMutation, useGetExerciseProgramQuery, useDeleteExerciseApiMutation, useEditExerciseApiMutation, useAddSetToExerciseApiMutation, useDeleteSetFromExerciseApiMutation, useDeleteWeekApiMutation, useHandleAddWeekApiMutation } = newWorkoutProgramApi;