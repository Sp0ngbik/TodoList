import { appActions } from "app/model/appSlice"
import { Dispatch } from "@reduxjs/toolkit"

export const successHandler = (dispatch: Dispatch, informMessage: string) => {
  dispatch(appActions.appSetStatusAC({ status: "succeeded" }))
  dispatch(appActions.appSetInformMessageAC({ informMessage }))
}
