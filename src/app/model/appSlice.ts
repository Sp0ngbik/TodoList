import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"

export type T_ResponseStatus = "idle" | "loading" | "succeeded" | "failed"

export type T_AppReducer = {
  status: T_ResponseStatus
  informMessage: string | null
  appInitialize: boolean
}

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
    setAppInitialized: (state, action: PayloadAction<{ appInitialized: boolean }>) => {
      state.appInitialize = action.payload.appInitialized
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.status = "loading"
      })
      .addMatcher(isFulfilled, (state) => {
        state.status = "succeeded"
      })
      .addMatcher(isRejected, (state) => {
        state.status = "failed"
      })
  },
})

export const appActions = appSlice.actions

export const appReducer = appSlice.reducer
