import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
    userId: string | null;
}

const initialState: userState = {
    userId: null,
}


const userSlice = createSlice({
    name: "user", 
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<string | null>) => {
            state.userId = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;

export const userReducer = userSlice.reducer;