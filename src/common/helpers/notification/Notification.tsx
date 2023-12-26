import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "common/hooks/redux_hooks/useAction"
import { appActions } from "app/model/appSlice"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"

export const Notification = React.memo(() => {
  const dispatch = useAppDispatch()
  const appStatus = useAppSelector((state) => state.app)

  useEffect(() => {
    if (appStatus.informMessage && appStatus.status === "failed") {
      toast.error(appStatus.informMessage)
    } else if (appStatus.informMessage && appStatus.status === "succeeded") {
      toast.success(appStatus.informMessage)
    }
    toast.onChange(({ status }) => {
      if (status === "added") {
        dispatch(appActions.appSetStatusAC({ status: "idle" }))
        dispatch(appActions.appSetInformMessageAC({ informMessage: null }))
      }
    })
  }, [appStatus, dispatch])

  return <ToastContainer theme="dark" hideProgressBar={true} autoClose={1000} />
})
