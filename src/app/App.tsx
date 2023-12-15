import React, { useEffect } from "react"
import { useActions, useAppSelector } from "common/hooks/redux_hooks/hooks"
import LoadingScale from "../common/helpers/loadingScale/LoadingScale"
import { Notification } from "common/helpers/notification/Notification"
import { Route, Routes } from "react-router-dom"
import Login from "../common/components/Login/ui/Login"
import TodoListLists from "../common/components/TodoListLists/ui/TodoListLists/TodoListLists"
import { asyncApp } from "./model/appSlice"

const App = React.memo(() => {
  const { fetchInitApp } = useActions(asyncApp)
  useEffect(() => {
    fetchInitApp()
  }, [fetchInitApp])
  const appInitStatus = useAppSelector((state) => state.app.appInitialize)
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
