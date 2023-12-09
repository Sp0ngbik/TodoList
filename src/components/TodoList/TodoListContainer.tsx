import React, { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks/hooks"
import { todoListSelector } from "../../redux/selectorsHandler"
import { fetchTodoLists } from "../../redux/reducers/todoList_reducer"
import style from "../../app/app.module.css"
import { TodoLists } from "./TodoLists"
import AddNewTodo from "../AddNewTodo/AddNewTodo"
import { Navigate } from "react-router-dom"
import { fetchLogout } from "../../redux/reducers/auth_reducer"

const TodoListContainer = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTodoLists())
  }, [dispatch])
  const todoListsData = useAppSelector(todoListSelector)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const logOutHandler = useCallback(() => {
    dispatch(fetchLogout())
  }, [dispatch])
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <AddNewTodo />
      <button onClick={logOutHandler}>LOGOUT</button>
      <div className={style.allTodosWrapper}>
        {todoListsData.map((tl) => (
          <div key={tl.id}>
            <TodoLists
              title={tl.title}
              todoListId={tl.id}
              filter={tl.filter}
              entityStatus={tl.entityStatus}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default TodoListContainer
