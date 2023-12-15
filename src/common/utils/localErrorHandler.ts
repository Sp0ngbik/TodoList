import { Dispatch } from "@reduxjs/toolkit"
import { AxiosResponse } from "axios"
import { appActions } from "app/model/appSlice"

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
