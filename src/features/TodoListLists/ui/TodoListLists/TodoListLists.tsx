import React, { useCallback, useEffect } from "react"
import AddNewItem from "common/components/AddNewTodo/AddNewItem"
import { Navigate } from "react-router-dom"
import { TodoList } from "../TodoList/TodoLists"
import style from "./todoLists.module.css"
import { asyncTodoList, fetchAddNewTodoList, todoListSelector } from "features/TodoListLists/model"
import { isLoggedInSelector } from "features/Login/model/authSelectors"
import { asyncAuthActions } from "features/Login/model/authSlice"
import { useActions, useAppSelector } from "common/hooks/redux_hooks"

const TodoListLists = () => {
  const { fetchTodoLists } = useActions(asyncTodoList)
  const { fetchLogout } = useActions(asyncAuthActions)
  useEffect(() => {
    fetchTodoLists()
  }, [fetchTodoLists])
  const todoListsData = useAppSelector(todoListSelector)
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const logOutHandler = useCallback(() => {
    fetchLogout()
  }, [fetchLogout])
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <AddNewItem callback={fetchAddNewTodoList} />
      <button onClick={logOutHandler}>LOGOUT</button>
      <div className={style.allTodosWrapper}>
        {todoListsData.map((tl) => (
          <div key={tl.id}>
            <TodoList
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

export default TodoListLists
