import { appActions } from "app/model/appSlice"
import axios from "axios"
import { Dispatch } from "@reduxjs/toolkit"

export type T_ErrorType = {
  messages: { field: string; message: string }[]
}

export type ThunkErrorAPI = { errors: string; fieldErrors?: T_ErrorType }

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
  return rejectValue({ errors: [errorMessage], fieldsErrors: undefined })
}
