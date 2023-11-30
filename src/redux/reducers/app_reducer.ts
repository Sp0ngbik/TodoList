import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type T_ResponseStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type T_AppReducer = {
    status: T_ResponseStatus,
    informMessage: string | null
}
const initialState: T_AppReducer = {
    status: 'idle',
    informMessage: null
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        appSetStatusAC: (state, action: PayloadAction<{ status: T_ResponseStatus }>) => {
            state.status = action.payload.status
        },
        appSetInformMessageAC: (state, action: PayloadAction<{ informMessage: string | null }>) => {
            state.informMessage = action.payload.informMessage
        }
    }
})

export const {appSetStatusAC, appSetInformMessageAC} = appSlice.actions
export const app_reducer = appSlice.reducer
