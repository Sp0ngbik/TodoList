import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "app/store"
import { useMemo } from "react"
import { ActionCreatorsMapObject, bindActionCreators } from "redux"

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useActions = <T extends ActionCreatorsMapObject<any>>(actions: T) => {
  const dispatch = useAppDispatch()
  return useMemo(() => {
    return bindActionCreators(actions, dispatch)
  }, [dispatch, actions])
}
