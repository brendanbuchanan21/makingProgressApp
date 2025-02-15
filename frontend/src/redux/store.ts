import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";
import { newWorkoutProgramApi } from "./workoutApi";
import storage  from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";


// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage, // ✅ Corrected from Storage to storage
  whitelist: ["workout"], // ✅ Persist only the workout slice
};

// Combine reducers
const rootReducer = combineReducers({
  workout: workoutReducer, // Persisted state
  [newWorkoutProgramApi.reducerPath]: newWorkoutProgramApi.reducer, // RTK Query API state (not persisted)
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with Redux Persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Required for Redux Persist to avoid errors
    }).concat(newWorkoutProgramApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Create Persistor
export const persistor = persistStore(store);

// Types & Export
export type RootState = ReturnType<typeof store.getState>;
export default store;