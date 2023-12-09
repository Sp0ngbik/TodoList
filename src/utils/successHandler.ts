import { AppActions } from "../redux/reducers/app_reducer"
import { Dispatch } from "@reduxjs/toolkit"

export const successHandler = (dispatch: Dispatch, informMessage: string) => {
  dispatch(AppActions.appSetStatusAC({ status: "succeeded" }))
  dispatch(AppActions.appSetInformMessageAC({ informMessage }))
}
