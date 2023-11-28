import {AppDispatch} from "../redux/store";
import {appSetInformMessageAC, appSetStatusAC} from "../redux/reducers/app_reducer";
import {AxiosResponse, isAxiosError} from "axios";

export type T_ErrorType = {
    messages: { field: string, message: string }[]
}


export const networkErrorHandler = (dispatch: AppDispatch, err: unknown) => {
    console.log(err)
    let errorMessage: string;
    if (isAxiosError<T_ErrorType>(err)) {
        errorMessage = err.response ? err.response.data.messages[0].message : err.message
    } else {
        errorMessage = (err as Error).message
    }
    dispatch(appSetStatusAC('failed'))
    dispatch(appSetInformMessageAC(errorMessage))

}

export const localErrorHandler = (dispatch: AppDispatch, err: AxiosResponse) => {
    dispatch(appSetStatusAC('failed'))
    dispatch(appSetInformMessageAC(err.data.messages[0]))
}