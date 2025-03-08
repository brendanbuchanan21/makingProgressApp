import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Exercise } from "./workoutSlice";
import { NumberSchema } from "firebase/vertexai";

interface completedSet {
    setNumber: number,
    reps: number,
    weight: number,
    rir: number,
    volume: number
}


interface completedExercise {
    id: string;
    name: string;
    muscleGroup: string;
    muscleGroupVolume: number; 
    sets: completedSet[];
}

interface completedWorkoutResponse {
    workoutPlanId: string,
    weekNumber: number, 
    day: string,
    totalVolume: number,
    exercises: completedExercise[]

}
interface completedWorkoutRequest {
    workoutPlanId: string;
    weekNumber: number;
    day: string;
    exercises: Exercise[];
}

  




export const completedWorkoutApi = createApi({
    reducerPath: 'completedWorkoutApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/completedWorkout'}),
    endpoints: (builder) => ({
        postCompletedExercise: builder.mutation<completedWorkoutResponse, completedWorkoutRequest>({
            query: (completedWorkout) => ({
                url: '',
                method: 'POST',
                body: completedWorkout,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }),
        getCompletedWorkoutVolume: builder.query<completedWorkoutResponse, { workoutPlanId: string }>({
            query: (workoutPlanId) => ({
                url: `/completedWorkouts?workoutPlanId=${workoutPlanId}`,
                method: 'GET',
            })
        })
    })
})

export const { usePostCompletedExerciseMutation, useGetCompletedWorkoutVolumeQuery } = completedWorkoutApi;