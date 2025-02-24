import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface bodyWeightRequest {
    date: string;
    weight: number;
}
interface bodyWeightResponse {
    id: string
}


export const newBodyWeightApi = createApi({
    reducerPath: 'bodyWeightApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/bodyWeight'}),
    endpoints: (builder) => ({
        postBodyWeightEntry: builder.mutation<bodyWeightResponse, bodyWeightRequest>({
            query: (bodyWeightEntry) => ({
                url: '/',
                method: 'POST',
                body: bodyWeightEntry
            })
        })
    })
})

export const { usePostBodyWeightEntryMutation } = newBodyWeightApi