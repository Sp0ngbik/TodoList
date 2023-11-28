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
type T_SetInformMessage = ReturnType<typeof appSetInformMessageAC>
type T_MainAppReducer = T_SetErrors | T_SetInformMessage

export const app_reducer = (state = initialState, action: T_MainAppReducer) => {
    switch (action.type) {
        case "APP/SET_ERROR": {
            return {...state, status: action.status}
        }
        case "APP/SET_INFORM_MESSAGE": {
            return {...state, informMessage: action.informMessage}
        }
        default:
            return state
    }
}

export const appSetStatusAC = (status: T_ResponseStatus,) => {
    return {type: 'APP/SET_ERROR', status,} as const
}

export const appSetInformMessageAC = (informMessage: string | null) => {
    return {type: 'APP/SET_INFORM_MESSAGE', informMessage} as const
}
