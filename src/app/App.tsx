import React, { useEffect } from "react"
import { useActions, useAppSelector } from "common/hooks/redux_hooks/useAction"
import LoadingScale from "../common/helpers/loadingScale/LoadingScale"
import { Notification } from "common/helpers/notification/Notification"
import { Route, Routes } from "react-router-dom"
import { appInitialize } from "app/model/appSelectors"
import { asyncAuthActions } from "features/Login/model/authSlice"
import TodoListLists from "features/TodoListLists/ui/TodoListLists"
import Login from "features/Login/ui/Login"

const App = React.memo(() => {
  const { fetchInitApp } = useActions(asyncAuthActions)
  useEffect(() => {
    fetchInitApp()
  }, [fetchInitApp])

  const appInitStatus = useAppSelector(appInitialize)
  if (!appInitStatus) {
    return <div>LOADING</div>
  }
  return (
    <div>
      <LoadingScale />
      <Notification />
      <Routes>
        <Route path={"/"} element={<TodoListLists />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </div>
  )
})

export default App
