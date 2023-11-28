import {AppDispatch} from "../redux/store";
import {appSetStatusAC} from "../redux/reducers/app_reducer";
import {AxiosResponse, isAxiosError} from "axios";

export type T_ErrorType = {
    messages: { field: string, message: string }[]
}


export const networkErrorHandler = (dispatch: AppDispatch, err: unknown) => {
    let errorMessage: string;
    if (isAxiosError<T_ErrorType>(err)) {
        errorMessage = err.response ? err.response.data.messages[0].message : err.message
    } else {
        errorMessage = (err as Error).message
    }
    dispatch(appSetStatusAC('failed', errorMessage))
}

export const localErrorHandler = (dispatch:AppDispatch, err:AxiosResponse)=>{
    dispatch(appSetStatusAC('failed',err.data.messages[0]))
}