import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
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
    // console.log(getCookie('accessToken'));
    setCookie('accessToken', res.accessToken);
    // console.log(getCookie('accessToken'));
    return res;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const res = await logoutApi();
  // console.log(localStorage.getItem('refreshToken'));
  localStorage.removeItem('refreshToken');
  // console.log(localStorage.getItem('refreshToken'));
  deleteCookie('accessToken');
  return res;
});

export const checkAuthUser = createAsyncThunk('user/checkAuth', async () => {
  // console.log(localStorage.getItem('refreshToken'));
  const res = await getUserApi();
  return res;
});

export const updateUserInfo = createAsyncThunk(
  'user/updateInfo',
  async (data: Partial<TRegisterData>) => {
    const res = await updateUserApi(data);
    // console.log(res);
    return res;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        // state.user = action.payload.user;
        // console.log(action.payload.success);
        state.isSuccessRegistration = true;
        // state.isAuthenticated = true;
        // state.isAuthChecked = true;
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
        // console.log(action.payload.user);
        state.user = action.payload.user;
        // console.log(action.payload.success);
        // state.isSuccessRegistration = true;
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
        // state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload.user;
        // state.isAuthChecked = true;
        // console.log(action.payload.success);
        // state.isSuccessRegistration = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
        // state.isAuthChecked = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.user = action.payload.user;
        // state.isAuthChecked = true;
        // console.log(action.payload.success);
        // state.isSuccessRegistration = true;
        // state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isUserLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isUserLoading = false;
        state.error = action.error.message;
        // state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isUserLoading = false;
        // state.isAuthChecked = true;
        // state.isSuccessRegistration = true;
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
export const {
  selectUser,
  selectIsLoadingUser,
  selectIsAuthChecked,
  selectIsAuthenticated,
  selectIsSuccessRegistration
} = userSlice.selectors;
