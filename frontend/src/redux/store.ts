import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";
import { newWorkoutProgramApi } from "./workoutApi";
import storage  from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { newBioMetricApi } from "./biometricApi";
import { biometricReducer } from "./biometricSlice";


// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["workout"], 
};

// Combine reducers
const rootReducer = combineReducers({
  workout: workoutReducer, // Persisted state
  biometric: biometricReducer,
  [newWorkoutProgramApi.reducerPath]: newWorkoutProgramApi.reducer, 
  [newBioMetricApi.reducerPath]: newBioMetricApi.reducer// RTK Query API state (not persisted)
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with Redux Persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(newWorkoutProgramApi.middleware, newBioMetricApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Create Persistor
export const persistor = persistStore(store);

// Types & Export
export type RootState = ReturnType<typeof store.getState>;
export default store;