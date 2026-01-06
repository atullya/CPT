import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import jobsReducer from './jobs/jobsSlice';
import candidatesReducer from './candidates/candidatesSlice';
import { baseApi } from './baseApi.config';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    candidates: candidatesReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production', // Vite-friendly DevTools check
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;