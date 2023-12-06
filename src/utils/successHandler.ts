import {appSetInformMessageAC, appSetStatusAC} from "../redux/reducers/app_reducer";
import {Dispatch} from "@reduxjs/toolkit";

export const successHandler = (dispatch: Dispatch, informMessage: string) => {
    dispatch(appSetStatusAC({status:'succeeded'}))
    dispatch(appSetInformMessageAC({informMessage}))
}