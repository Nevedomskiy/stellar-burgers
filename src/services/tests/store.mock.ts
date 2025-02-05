import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store/store';

export const mockStore = configureStore({
  reducer: rootReducer
});
