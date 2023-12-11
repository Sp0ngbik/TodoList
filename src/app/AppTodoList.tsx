import React, { useEffect } from "react"
import { useActions, useAppSelector } from "../hooks/redux_hooks/hooks"
import LoadingScale from "../helpers/loadingScale/LoadingScale"
import { Notification } from "../helpers/notification/Notification"
import { asyncApp } from "../redux/reducers"
import { Route, Routes } from "react-router-dom"
import Login from "../components/Login/Login"
import TodoListLists from "../components/TodoListLists/TodoListLists"

const AppTodoList = React.memo(() => {
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

export default AppTodoList
