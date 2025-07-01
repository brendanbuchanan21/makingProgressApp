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
        getNoPlanWorkoutsByDate: builder.query<any, { from: string | null; to: string; limit?: number }>({
        query: ({ from, to, limit = 10 }) => {
            const queryParams = [
            from ? `from=${from}` : null,
            to ? `to=${to}` : null,
            limit ? `limit=${limit}` : null,
            ]
            .filter(Boolean)
            .join("&");

            return {
            url: `/?${queryParams}`,
            method: "GET",
            };
        },
        }),
    })
})

export const { usePostNoPlanWorkoutMutation, useGetNoPlanWorkoutsByDateQuery } = noPlanWorkoutApi;