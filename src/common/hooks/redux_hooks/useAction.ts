import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "app/store"
import { useMemo } from "react"
import { ActionCreatorsMapObject, bindActionCreators } from "redux"

type DispatchFunc = () => AppDispatch
export const useAppDispatch: DispatchFunc = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
  const dispatch = useAppDispatch()

  return useMemo(
    () => bindActionCreators<T, RemapActionCreators<T>>(actions, dispatch),
    [actions, dispatch],
  )
}

type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true
type ActionCreatorResponse<T extends (...args: any[]) => any> = ReturnType<ReturnType<T>>
type ReplaceReturnType<T, TNewReturn> = T extends (...args: any[]) => unknown
  ? IsValidArg<Extract<T, (...args: any[]) => any>> extends true
    ? (...args: Parameters<Extract<T, (...args: any[]) => any>>) => TNewReturn
    : () => TNewReturn
  : never

type RemapActionCreators<T extends ActionCreatorsMapObject> = {
  [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>
}
