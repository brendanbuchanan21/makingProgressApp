import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";
import { newWorkoutProgramApi } from "./workoutApi";
import storage  from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { newBioMetricApi } from "./biometricApi";
import { biometricReducer } from "./biometricSlice";
import { bodyWeightReducer } from "./bodyWeightSlice";
import { newBodyWeightApi } from "./bodyWeightApi";
import { completedWorkoutApi } from "./completedWorkoutApi";
import { aggregateVolumeApi } from "./volumeApi";
import { userReducer } from "./userSlice";
import { completedWorkoutProgramsReducer } from "./completedProgramsSlice";
import { completedProgramApi } from "./completedProgramsApi";
import { quickWorkoutReducer } from "./noPlanWorkoutSlice";

// Configuration for Redux Persist
const persistConfig = {
  key: "root",
  storage, 
  whitelist: ["workout"], 
};

// Combine reducers
const rootReducer = combineReducers({
  workout: workoutReducer,
  completedPrograms: completedWorkoutProgramsReducer,
  biometric: biometricReducer,
  bodyWeight: bodyWeightReducer,
  user: userReducer,
  quickWorkout: quickWorkoutReducer,
  [newWorkoutProgramApi.reducerPath]: newWorkoutProgramApi.reducer, 
  [newBioMetricApi.reducerPath]: newBioMetricApi.reducer,
  [newBodyWeightApi.reducerPath]: newBodyWeightApi.reducer,
  [completedWorkoutApi.reducerPath]: completedWorkoutApi.reducer,
  [aggregateVolumeApi.reducerPath]: aggregateVolumeApi.reducer,
  [completedProgramApi.reducerPath]: completedProgramApi.reducer,
  

});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with Redux Persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(newWorkoutProgramApi.middleware, newBioMetricApi.middleware, newBodyWeightApi.middleware, completedWorkoutApi.middleware, aggregateVolumeApi.middleware, completedProgramApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Create Persistor
export const persistor = persistStore(store);

// Types & Export
export type RootState = ReturnType<typeof store.getState>;
export default store;