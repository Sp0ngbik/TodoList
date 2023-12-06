import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {auth_API} from "../../api/auth_API";

export type T_ResponseStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type T_AppReducer = {
    status: T_ResponseStatus,
    informMessage: string | null
}

export const fetchInitApp = createAsyncThunk('app/init', async (arg, thunkAPI) => {
    const response = await auth_API
})

const appSlice = createSlice({
    name: "app",
    initialState: {
        status: 'idle',
        informMessage: null
    } as T_AppReducer,
    reducers: {
        appSetStatusAC: (state, action: PayloadAction<{ status: T_ResponseStatus }>) => {
            state.status = action.payload.status
        },
        appSetInformMessageAC: (state, action: PayloadAction<{ informMessage: string | null }>) => {
            state.informMessage = action.payload.informMessage
        }
    }
})

export const {
    appSetStatusAC,
    appSetInformMessageAC
} = appSlice.actions
export const app_reducer = appSlice.reducer
