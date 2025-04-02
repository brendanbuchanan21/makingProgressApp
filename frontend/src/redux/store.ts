import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { workoutReducer } from "./workoutSlice";
import { newWorkoutProgramApi } from "./workoutApi";
import storage  from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { completedWorkoutApi } from "./completedWorkoutApi";
import { aggregateVolumeApi } from "./volumeApi";
import { userReducer } from "./userSlice";
import { completedWorkoutProgramsReducer } from "./completedProgramsSlice";
import { completedProgramApi } from "./completedProgramsApi";
import { quickWorkoutReducer } from "./noPlanWorkoutSlice";
import { noPlanWorkoutApi } from "./noPlanWorkoutApi";
import { userDataApi } from "./userDataApi";

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
  user: userReducer,
  quickWorkout: quickWorkoutReducer,
  [newWorkoutProgramApi.reducerPath]: newWorkoutProgramApi.reducer, 
  [completedWorkoutApi.reducerPath]: completedWorkoutApi.reducer,
  [aggregateVolumeApi.reducerPath]: aggregateVolumeApi.reducer,
  [completedProgramApi.reducerPath]: completedProgramApi.reducer,
  [noPlanWorkoutApi.reducerPath]: noPlanWorkoutApi.reducer,
  [userDataApi.reducerPath]: userDataApi.reducer,
  

});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with Redux Persist
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(newWorkoutProgramApi.middleware, completedWorkoutApi.middleware, aggregateVolumeApi.middleware, completedProgramApi.middleware, noPlanWorkoutApi.middleware, userDataApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Create Persistor
export const persistor = persistStore(store);

// Types & Export
export type RootState = ReturnType<typeof store.getState>;
export default store;