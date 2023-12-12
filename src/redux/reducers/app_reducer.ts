import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { auth_API } from "../../api/auth_API"
import { authActions } from "./auth_reducer"
import { localErrorHandler } from "../../utils/errorsHandler"

export type T_ResponseStatus = "idle" | "loading" | "succeeded" | "failed"

export type T_AppReducer = {
  status: T_ResponseStatus
  informMessage: string | null
  appInitialize: boolean
}

const fetchInitApp = createAsyncThunk("app/init", async (arg, { dispatch, rejectWithValue }) => {
  const response = await auth_API.authMe()
  if (response.data.resultCode === 0) {
    dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
  } else {
    localErrorHandler(dispatch, response)
  }
})

const appSlice = createSlice({
  name: "app",
  initialState: {
    status: "idle",
    informMessage: null,
    appInitialize: false,
  } as T_AppReducer,
  reducers: {
    appSetStatusAC: (state, action: PayloadAction<{ status: T_ResponseStatus }>) => {
      state.status = action.payload.status
    },
    appSetInformMessageAC: (state, action: PayloadAction<{ informMessage: string | null }>) => {
      state.informMessage = action.payload.informMessage
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInitApp.fulfilled, (state, action) => {
      state.appInitialize = true
    })
  },
})

export const appActions = appSlice.actions

export const app_reducer = appSlice.reducer

export const asyncApp = { fetchInitApp }
