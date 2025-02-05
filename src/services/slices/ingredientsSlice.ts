import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export interface IngredientsListState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: null | string | undefined;
}

const initialState: IngredientsListState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};

export const getIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/getIngredients',
  async () => {
    const res = await getIngredientsApi();
    return res;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoadingIngredients: (state) => state.isIngredientsLoading
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;
export const { selectIngredients, selectIsLoadingIngredients } =
  ingredientsSlice.selectors;
