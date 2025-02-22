import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface weightEntry {
    date: string,
    weight: number
}

interface weightState {
    entries: weightEntry[];
    initialWeight: number | null;
    initialWeightDate: string | null;
}

const initialState: weightState = {
    entries: [],
    initialWeight: null,
    initialWeightDate: null,
}

const bodyWeightSlice = createSlice({
    name: "bodyWeight",
    initialState,
    reducers: {
        addBodyWeightEntry: (state, action: PayloadAction<weightEntry>) => {
            state.entries.push(action.payload);
        },
        addInitialWeight: (state, action: PayloadAction<{ weight: number; date: string }>) => {
            if(state.initialWeight === null) {
                state.initialWeight = action.payload.weight;
                state.initialWeightDate = action.payload.date;
            }
        }
    }
})

export const { addBodyWeightEntry, addInitialWeight } = bodyWeightSlice.actions;
export const bodyWeightReducer = bodyWeightSlice.reducer;