import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";


export const completedProgramApi = createApi({
    reducerPath: 'completedProgramApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/completedPrograms',
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
        postCompletedProgram: builder.mutation<any, { workoutPlanId: string, name: string, startDate: string, duration: string}>({
            query: (completedPlan) => ({
                url: '/', 
                method: 'POST',
                body: completedPlan
            })
        }),
        getCompletedProgram: builder.query<any, void>({
            query: () => ({
                url: '/',
                method: 'GET'
            })
        })
    })
})

export const { usePostCompletedProgramMutation, useGetCompletedProgramQuery } = completedProgramApi