import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppActions } from "./app_reducer"
import { auth_API, T_AuthorizeData } from "../../api/auth_API"
import { networkErrorHandler } from "../../utils/errorsHandler"

export const fetchLogin = createAsyncThunk(
  "auth/login",
  async (arg: { data: T_AuthorizeData }, { dispatch, rejectWithValue }) => {
    dispatch(AppActions.appSetStatusAC({ status: "loading" }))
    try {
      const response = await auth_API.loginMe(arg.data)
      if (response.data.resultCode === 0) {
        dispatch(AppActions.appSetStatusAC({ status: "succeeded" }))
      } else {
        networkErrorHandler(dispatch, response.data)
        return rejectWithValue({
          errors: response.data.messages,
          fieldErrors: response.data.fieldsErrors,
        })
      }
    } catch (e) {
      networkErrorHandler(dispatch, e)
      return rejectWithValue({ errors: ["error"], fieldErrors: undefined })
    } finally {
      dispatch(AppActions.appSetStatusAC({ status: "succeeded" }))
    }
  },
)
export const fetchLogout = createAsyncThunk("auth/logout", async (arg, { dispatch, rejectWithValue }) => {
  dispatch(AppActions.appSetStatusAC({ status: "loading" }))
  try {
    const response = await auth_API.logOutMe()
    if (response.data.resultCode === 0) {
      return
    } else {
      networkErrorHandler(dispatch, response.data)
      return rejectWithValue(null)
    }
  } catch (e) {
    networkErrorHandler(dispatch, e)
    return rejectWithValue(null)
  } finally {
    dispatch(AppActions.appSetStatusAC({ status: "succeeded" }))
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

export const authReducer = authSlice.reducer
export const AuthActions = authSlice.actions
export const asyncAuthActions = { fetchLogin, fetchLogout }
