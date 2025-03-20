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
    _id: string;
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

            if(user) {
                try {
                    const token = await user.getIdToken();
                    headers.set('Authorization', `Bearer ${token}`);
                } catch(error) {
                    console.error('error getting id token:', error);
                }
            } else {
                console.log('no user logged in');
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
        getCompletedWorkoutVolume: builder.query<completedWorkoutResponse, string>({
            query: (workoutPlanId) => ({
                url: `/completedWorkouts?workoutPlanId=${workoutPlanId}`,
                method: 'GET',
            })
        })
    })
})

export const { usePostCompletedExerciseMutation, useGetCompletedWorkoutVolumeQuery } = completedWorkoutApi;