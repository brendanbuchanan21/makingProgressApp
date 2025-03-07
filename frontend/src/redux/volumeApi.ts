import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface muscleGroupVolume {
    id: string,
    totalVolume: number
}

export const aggregateVolumeApi = createApi({
    reducerPath: 'volumeApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/volume/'}),
    endpoints: (builder) => ({
        getTotalMuscleGroupVolume: builder.query<muscleGroupVolume, void>({
            query: () => 'muscle-volume'
        })
    })
})


export const { useGetTotalMuscleGroupVolumeQuery } = aggregateVolumeApi;