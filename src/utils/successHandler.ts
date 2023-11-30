import {AppDispatch} from "../redux/store";
import {appSetInformMessageAC, appSetStatusAC} from "../redux/reducers/app_reducer";

export const successHandler = (dispatch: AppDispatch, informMessage: string) => {
    dispatch(appSetStatusAC({status:'succeeded'}))
    dispatch(appSetInformMessageAC({informMessage}))
}