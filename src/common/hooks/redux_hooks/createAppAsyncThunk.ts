import { createAsyncThunk } from "@reduxjs/toolkit"
import { AppDispatch, RootState } from "app/store"
import { ThunkErrorAPI } from "../../utils/networkErrorHandler"

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
  rejectValue: ThunkErrorAPI
}>()
