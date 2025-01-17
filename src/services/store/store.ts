import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { feedsReducer } from '../slices/feedsSlice';
import { ingredientsReducer } from '../slices/ingredientsSlice';
import { ordersReducer } from '../slices/ordersSlice';
import { userReducer } from '../slices/userSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feeds: feedsReducer,
  user: userReducer,
  orders: ordersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
