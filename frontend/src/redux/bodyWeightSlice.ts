import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface weightEntry {
    date: string,
    weight: number
}

interface weightState {
    entries: weightEntry[];
    initialWeight: number | null;
}

const initialState: weightState = {
    entries: [],
    initialWeight: null
}

const bodyWeightSlice = createSlice({
    name: "bodyWeight",
    initialState,
    reducers: {
        addBodyWeightEntry: (state, action: PayloadAction<weightEntry>) => {
            state.entries.push(action.payload)
            if (state.initialWeight === null) {
                state.initialWeight = action.payload.weight;
            }
        }
    }
})