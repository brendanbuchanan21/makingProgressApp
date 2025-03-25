import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuth } from 'firebase/auth'

interface muscleGroupVolume {
    id: string,
    totalVolume: number
}

export const aggregateVolumeApi = createApi({
    reducerPath: 'volumeApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/volume/',
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
        getTotalMuscleGroupVolume: builder.query<muscleGroupVolume, void>({
            query: () => 'muscle-volume'
        }),
        getTotalVolume: builder.query({
            query: (timescale) => {
                return `/accumulated-volume?timescale=${timescale}`;
            }
        })
    })
})


export const { useGetTotalMuscleGroupVolumeQuery, useGetTotalVolumeQuery } = aggregateVolumeApi;