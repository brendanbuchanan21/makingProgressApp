import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';


export const userDataApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/userData`, prepareHeaders: async (headers, { getState }) => {
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
        resetUserData: builder.mutation({
            query: () => ({
                url: '/',
                method: "DELETE"
            })
        }),
    })
});

export const { useResetUserDataMutation } = userDataApi