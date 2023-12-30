import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "app/store"

export type T_ErrorType = {
  messages: { field: string; message: string }[]
}

export type ThunkErrorAPI = { errors: string; fieldErrors?: T_ErrorType }

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: ThunkErrorAPI | any
}>()
