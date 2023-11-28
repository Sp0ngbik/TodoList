export type T_ResponseStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type T_AppReducer = {
    status: T_ResponseStatus,
    informMessage: string | null
}
const initialState: T_AppReducer = {
    status: 'idle',
    informMessage: null
}

type T_SetErrors = ReturnType<typeof appSetStatusAC>
type T_MainAppReducer = T_SetErrors

export const app_reducer = (state = initialState, action: T_MainAppReducer) => {
    switch (action.type) {
        case "APP/SET_ERROR": {
            return {...state, status: action.status, informMessage: action.informMessage}
        }
        default:
            return state
    }
}

export const appSetStatusAC = (status: T_ResponseStatus, informMessage: null | string) => {
    return {type: 'APP/SET_ERROR', status, informMessage} as const
}

