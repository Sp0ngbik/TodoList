import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux_hooks/hooks"
import LoadingScale from "../helpers/loadingScale/LoadingScale"
import { Notification } from "../helpers/notification/Notification"
import TodoListContainer from "../components/TodoList/TodoListContainer"
import { fetchInitApp } from "../redux/reducers/app_reducer"
import { Route, Routes } from "react-router-dom"
import Login from "../components/Login/Login"

const AppTodoList = React.memo(() => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchInitApp())
  }, [dispatch])
  const appInitStatus = useAppSelector((state) => state.app.appInitialize)
  if (!appInitStatus) {
    return <div>LOADING</div>
  }
  return (
    <div>
      <LoadingScale />
      <Notification />
      <Routes>
        <Route path={"/"} element={<TodoListContainer />} />
        <Route path={"/login"} element={<Login />} />
      </Routes>
    </div>
  )
})

export default AppTodoList
