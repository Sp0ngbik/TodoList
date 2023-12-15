import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "../redux/store"
import { ThunkErrorAPI } from "./errorsHandler"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: ThunkErrorAPI
}>
