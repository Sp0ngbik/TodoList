export type T_ResponseStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type T_AppReducer = {
    status: T_ResponseStatus,
    errorMessage: string | null
}
const initialState: T_AppReducer = {
    status: 'idle',
    errorMessage: null
}

type T_SetErrors = ReturnType<typeof appSetStatusAC>
type T_MainAppReducer = T_SetErrors

export const app_reducer = (state = initialState, action: T_MainAppReducer) => {
    switch (action.type) {
        case "APP/SET_ERROR": {
            return {...state, status: action.status, errorMessage: action.errorMessage}
        }
        default:
            return state
    }
}

export const appSetStatusAC = (status: T_ResponseStatus, errorMessage: null | string) => {
    return {type: 'APP/SET_ERROR', status, errorMessage} as const
}

