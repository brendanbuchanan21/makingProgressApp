import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface biometricState {
    height: string | null;
    initialWeight: number | null;
    age: number | null;
    gender: string | null;
    activityLevel: string | null;
    goal: string | null;
    bmi: number | null;
    recommendedCalories: number | null;
    id?: string | null;
    leanBodyMass: number | null;
    bodyFatPercentage: number | null;
    protein: number | null;
    fats: number | null;
    carbs: number | null;
}

const initialState: biometricState = {
    height: null,
    initialWeight: null,
    age: null,
    gender: null,
    activityLevel: null,
    goal: null,
    bmi: null,
    recommendedCalories: null,
    id: null,
    leanBodyMass: null,
    bodyFatPercentage: null,
    protein: null,
    fats: null,
    carbs: null
}

const biometricSlice = createSlice({
    name: "biometric",
    initialState,
    reducers: {
        setBiometricData: (state, action: PayloadAction<biometricState>) => {
            return {...state, ...action.payload};
        },
        resetBiometricData: () => initialState,
    },
})

export const { setBiometricData, resetBiometricData } = biometricSlice.actions;
export const biometricReducer = biometricSlice.reducer;


