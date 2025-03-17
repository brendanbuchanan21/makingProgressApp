import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Exercise } from "./workoutSlice";
import { getAuth } from "firebase/auth";

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
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/completedWorkout',
        prepareHeaders: async (headers) => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                try {
                    const token = await user.getIdToken();
                    console.log('ID Token:', token); // Log the token
                    headers.set('Authorization', `Bearer ${token}`);
                } catch (error) {
                    console.error('Error getting ID token:', error); // Log any errors
                }
            } else {
              console.log('No user logged in.');
            }
            return headers;
        }
    }),
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
        getCompletedWorkoutVolume: builder.query<completedWorkoutResponse, string | any>({
            query: (workoutPlanId) => ({
                url: `/completedWorkouts?workoutPlanId=${workoutPlanId}`,
                method: 'GET',
            })
        })
    })
})

export const { usePostCompletedExerciseMutation, useGetCompletedWorkoutVolumeQuery } = completedWorkoutApi;