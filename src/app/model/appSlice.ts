import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { auth_API } from "../../common/components/Login/api/auth_API"
import { authActions } from "../../common/components/Login/model/authSlice"
import { createAppAsyncThunk } from "../../common/hooks/redux_hooks/createAppAsyncThunk"
import { ResultCode } from "../../common/enums/enums"
import { localErrorHandler } from "../../common/utils/localErrorHandler"

export type T_ResponseStatus = "idle" | "loading" | "succeeded" | "failed"

export type T_AppReducer = {
  status: T_ResponseStatus
  informMessage: string | null
  appInitialize: boolean
}

const fetchInitApp = createAppAsyncThunk("app/init", async (arg, { dispatch, rejectWithValue }) => {
  const response = await auth_API.authMe()
  if (response.data.resultCode === ResultCode.success) {
    dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
  } else {
    localErrorHandler(dispatch, response, rejectWithValue)
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

export const appReducer = appSlice.reducer

export const asyncApp = { fetchInitApp }
