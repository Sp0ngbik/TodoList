import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { appActions } from "app/model/appSlice"
import { auth_API, T_AuthorizeData } from "../api/auth_API"
import { networkErrorHandler } from "common/utils/networkErrorHandler"
import { createAppAsyncThunk } from "common/hooks/redux_hooks/createAppAsyncThunk"
import { ResultCode } from "common/enums/enums"
import { localErrorHandler } from "common/utils/localErrorHandler"

const fetchLogout = createAppAsyncThunk("auth/logout", async (arg, { dispatch, rejectWithValue }) => {
  dispatch(appActions.appSetStatusAC({ status: "loading" }))
  try {
    const response = await auth_API.logOutMe()
    if (response.data.resultCode === ResultCode.success) {
      return
    } else {
      return networkErrorHandler(dispatch, response.data, rejectWithValue)
    }
  } catch (e) {
    return networkErrorHandler(dispatch, e, rejectWithValue)
  }
})

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.isLoggedIn = true
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.isLoggedIn = false
      })
  },
})
export const fetchLogin = createAppAsyncThunk<null, T_AuthorizeData>(
  `${authSlice.name}/login`,
  async (data, { dispatch, rejectWithValue }) => {
    dispatch(appActions.appSetStatusAC({ status: "loading" }))
    try {
      const response = await auth_API.loginMe(data)
      if (response.data.resultCode === ResultCode.success) {
        dispatch(appActions.appSetStatusAC({ status: "succeeded" }))
      } else {
        return localErrorHandler(dispatch, response, rejectWithValue)
      }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)
export const authReducer = authSlice.reducer
export const authActions = authSlice.actions
export const asyncAuthActions = { fetchLogin, fetchLogout }
