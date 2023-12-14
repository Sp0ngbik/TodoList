import { appActions } from "../redux/reducers/app_reducer"
import { AxiosResponse, isAxiosError } from "axios"
import { Dispatch } from "@reduxjs/toolkit"

export type T_ErrorType = {
  messages: { field: string; message: string }[]
}

export type ThunkErrorAPI = {
  rejectValue: { errors: string; fieldErrors?: T_ErrorType }
}

export const localErrorHandler = (
  dispatch: Dispatch,
  err: AxiosResponse,
  rejectValue: Function,
  globalNotification: boolean = true,
) => {
  dispatch(appActions.appSetStatusAC({ status: "failed" }))
  if (globalNotification) {
    dispatch(appActions.appSetInformMessageAC({ informMessage: err.data.messages[0] }))
  }
  return rejectValue({ errors: err.data.messages[0], fieldsErrors: err.data.fieldsErrors })
}

export const networkErrorHandler = (dispatch: Dispatch, err: unknown, rejectValue: Function) => {
  let errorMessage: string
  if (isAxiosError<T_ErrorType>(err)) {
    errorMessage = err.response ? err.response.data.messages[0].message : err.message
  } else {
    errorMessage = (err as Error).message
  }
  dispatch(appActions.appSetStatusAC({ status: "failed" }))
  dispatch(appActions.appSetInformMessageAC({ informMessage: errorMessage }))
  // return rejectValue(null)
  return rejectValue({ errors: [errorMessage], fieldsErrors: undefined })
}
