import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface FeedListState {
  user: TUser;
  isUserLoading: boolean;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isSuccessRegistration: boolean;
  error: null | string | undefined;
}

const initialState: FeedListState = {
  user: { email: '', name: '' },
  isAuthChecked: false,
  isAuthenticated: false,
  isUserLoading: false,
  isSuccessRegistration: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const res = await registerUserApi(data);
    return res;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const res = await loginUserApi(data);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const res = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return res;
});

export const checkAuthUser = createAsyncThunk('user/checkAuth', async () => {
  const res = await getUserApi();
  return res;
});

export const updateUserInfo = createAsyncThunk(
  'user/updateInfo',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    return res;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
        state.isSuccessRegistration = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.isSuccessRegistration = true;
      })
      .addCase(checkAuthUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(checkAuthUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(checkAuthUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = { email: '', name: '' };
        state.isAuthenticated = false;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsLoadingUser: (state) => state.isUserLoading,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsSuccessRegistration: (state) => state.isSuccessRegistration,
    selectIsAuthenticated: (state) => state.isAuthenticated
  }
});

export const userReducer = userSlice.reducer;
export const { resetUserState } = userSlice.actions;

export const {
  selectUser,
  selectIsLoadingUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectIsSuccessRegistration
} = userSlice.selectors;
