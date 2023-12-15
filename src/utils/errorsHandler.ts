import { appActions } from "../redux/reducers/app_reducer"
import axios, { AxiosResponse } from "axios"
import { Dispatch } from "@reduxjs/toolkit"

export type T_ErrorType = {
  messages: { field: string; message: string }[]
}

export type ThunkErrorAPI = { errors: string; fieldErrors?: T_ErrorType }

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
  let errorMessage = "Some error occurred"

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
  } else {
    errorMessage = JSON.stringify(err)
  }
  dispatch(appActions.appSetInformMessageAC({ informMessage: errorMessage }))
  dispatch(appActions.appSetStatusAC({ status: "failed" }))
  return rejectValue({ errors: [errorMessage], fieldsErrors: undefined })
}
