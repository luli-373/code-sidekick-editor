
import { configureStore } from '@reduxjs/toolkit';
import websiteBuilderReducer from './websiteBuilderSlice';

export const store = configureStore({
  reducer: {
    websiteBuilder: websiteBuilderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
