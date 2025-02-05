import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { getOrdersApi, orderBurgerApi } from '../../utils/burger-api';

export interface ordersState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  userOrders: TOrder[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  isOrdersLoading: boolean;
  error: null | string | undefined;
}

export const initialState: ordersState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  userOrders: [],
  orderRequest: false,
  orderModalData: null,
  isOrdersLoading: false,
  error: null
};

export const getUserOrders = createAsyncThunk('orders/userOrders', async () => {
  const res = await getOrdersApi();
  return res;
});

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return res;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addBunInOrder: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredientInOrder: (state, action: PayloadAction<TIngredient>) => {
      const id = String(state.constructorItems.ingredients.length);
      state.constructorItems.ingredients.push({
        ...action.payload,
        id
      });
    },
    downIngredientInOrder: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const temp = state.constructorItems.ingredients[index];
      state.constructorItems.ingredients[index] = {
        ...state.constructorItems.ingredients[index + 1],
        id: index.toString()
      };
      state.constructorItems.ingredients[index + 1] = {
        ...temp,
        id: (index + 1).toString()
      };
    },
    upIngredientInOrder: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const temp = state.constructorItems.ingredients[index];
      state.constructorItems.ingredients[index] = {
        ...state.constructorItems.ingredients[index - 1],
        id: index.toString()
      };
      state.constructorItems.ingredients[index - 1] = {
        ...temp,
        id: (index - 1).toString()
      };
    },
    removeIngredientInOrder: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    resetOrder: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isOrdersLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.error = action.error.message;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.userOrders = action.payload;
      });
  },
  selectors: {
    selectUserOrders: (state) => state.userOrders,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsOrdersLoading: (state) => state.isOrdersLoading
  }
});

export const ordersReducer = ordersSlice.reducer;
export const {
  selectUserOrders,
  selectIsOrdersLoading,
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} = ordersSlice.selectors;

export const {
  addBunInOrder,
  addIngredientInOrder,
  downIngredientInOrder,
  upIngredientInOrder,
  removeIngredientInOrder,
  resetOrder
} = ordersSlice.actions;
