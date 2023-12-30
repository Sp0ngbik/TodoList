import { createSlice, isFulfilled } from "@reduxjs/toolkit"
import { appActions } from "app/model/appSlice"
import { auth_API, T_AuthorizeData } from "../api/auth_API"
import { createAppAsyncThunk } from "common/hooks/redux_hooks/createAppAsyncThunk"
import { ResultCode } from "common/enums/enums"

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isFulfilled(fetchLogin, fetchLogout, fetchInitApp), (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    })
  },
})
const fetchLogin = createAppAsyncThunk<{ isLoggedIn: true }, T_AuthorizeData>(
  `${authSlice.name}/login`,
  async (data, { dispatch, rejectWithValue }) => {
    const response = await auth_API.loginMe(data)
    if (response.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(response.data)
    }
  },
)
const fetchLogout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "auth/logout",
  async (arg, { dispatch, rejectWithValue }) => {
    const response = await auth_API.logOutMe()
    if (response.data.resultCode === ResultCode.success) {
      return { isLoggedIn: false }
    } else {
      return rejectWithValue(response.data)
    }
  },
)
const fetchInitApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  "app/init",
  async (arg, { dispatch, rejectWithValue }) => {
    const response = await auth_API.authMe().finally(() => {
      dispatch(appActions.setAppInitialized({ appInitialized: true }))
    })
    if (response.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true }
    } else {
      return rejectWithValue(response.data)
    }
  },
)

export const authReducer = authSlice.reducer
export const asyncAuthActions = { fetchLogin, fetchLogout, fetchInitApp }
