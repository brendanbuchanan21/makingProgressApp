import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';
import { noPlanWorkout } from './noPlanWorkoutSlice';


export const noPlanWorkoutApi = createApi({
    reducerPath: 'noPlanApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/noPlanWorkout`, prepareHeaders: async (headers) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) {
            const token = await user.getIdToken();
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            console.log("no user authenticated");
        }
        return headers;
    }}),
    endpoints: (builder) => ({
        postNoPlanWorkout: builder.mutation<void, noPlanWorkout>({
            query: (completedWorkout) => ({
                url: '/',
                method: 'POST',
                body: completedWorkout
            }),
        }),
        getNoPlanWorkouts: builder.query<any, void>({
            query: () => ({
                url: '/',
                method: "GET",
            })
        })
    })
})

export const { usePostNoPlanWorkoutMutation, useGetNoPlanWorkoutsQuery } = noPlanWorkoutApi;