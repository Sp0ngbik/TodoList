import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/model/appSlice"
import { auth_API, T_AuthorizeData } from "../api/auth_API"
import { networkErrorHandler } from "common/utils/networkErrorHandler"
import { createAppAsyncThunk } from "common/hooks/redux_hooks/createAppAsyncThunk"
import { ResultCode } from "common/enums/enums"
import { localErrorHandler } from "common/utils/localErrorHandler"

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
      .addCase(fetchInitApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn
      })
  },
})
const fetchLogin = createAppAsyncThunk<{ isLoggedIn: true }, T_AuthorizeData>(
  `${authSlice.name}/login`,
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(appActions.appSetStatusAC({ status: "loading" }))
    try {
      const response = await auth_API.loginMe(data)
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.appSetStatusAC({ status: "succeeded" }))
        return { isLoggedIn: true }
      } else {
        return localErrorHandler(dispatch, response, rejectWithValue)
      }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)
const fetchLogout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/logout",
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(appActions.appSetStatusAC({ status: "loading" }))
    try {
      const response = await auth_API.logOutMe()
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.appSetStatusAC({ status: "succeeded" }))
        return { isLoggedIn: false }
      } else {
        return networkErrorHandler(dispatch, response.data, rejectWithValue)
      }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)
const fetchInitApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "app/init",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const response = await auth_API.authMe()
      if (response.data.resultCode === ResultCode.success) {
        return { isLoggedIn: true }
      } else {
        return localErrorHandler(dispatch, response, rejectWithValue)
      }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    } finally {
      dispatch(appActions.setAppInitialized({ appInitialized: true }))
    }
  },
)

export const authReducer = authSlice.reducer
export const asyncAuthActions = { fetchLogin, fetchLogout, fetchInitApp }
