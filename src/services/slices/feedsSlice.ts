import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

interface FeedListState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isFeedsLoading: boolean;
  error: null | string | undefined;
}

const initialState: FeedListState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isFeedsLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feeds/getFeeds', async () => {
  const res = await getFeedsApi();

  return res;
});

const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isFeedsLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isFeedsLoading = false;
        state.error = action.error.message;
        console.log(action);
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isFeedsLoading = false;
        const { orders, total, totalToday } = action.payload;
        state.orders = orders;
        state.total = total;
        state.totalToday = totalToday;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectIsLoadingFeeds: (state) => state.isFeedsLoading,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday
  }
});

export const feedsReducer = feedsSlice.reducer;
export const {
  selectOrders,
  selectIsLoadingFeeds,
  selectTotal,
  selectTotalToday
} = feedsSlice.selectors;
