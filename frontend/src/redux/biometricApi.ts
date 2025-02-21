import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface bioMetricRequest {
    height: string;
    weight: number;
    age: number;
    gender: any;
    activityLevel: any;
    goal: any;
    bodyFatPercentage: any;
}
interface bioMetricResponse {
    bmi: number;
    recommendedCalories: number;
    message: string;
    id: string
    leanBodyMass: number;
    protein: number,
    fats: number,
    carbs: number

}

interface bioMetricId {
    id: string;
}


export const newBioMetricApi = createApi({
    reducerPath: 'bioMetricApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/biometrics/'}),
    endpoints: (builder) => ({
        postBioMetrics: builder.mutation<bioMetricResponse, bioMetricRequest>({
            query: (bioMetricData) => ({
                url: '/',
                method: 'POST',
                body: bioMetricData
            }),
        }),
        deleteBioMetrics: builder.mutation<void, bioMetricId>({
            query: ({id}) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
        }),
    })
})

export const { usePostBioMetricsMutation } = newBioMetricApi