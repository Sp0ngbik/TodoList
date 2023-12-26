import React, { useCallback, useEffect } from "react"
import AddNewItem from "../../../../../features/AddNewTodo/AddNewItem"
import { Navigate } from "react-router-dom"
import { TodoList } from "../TodoList/TodoLists"
import style from "./todoLists.module.css"
import { asyncTodoList, fetchAddNewTodoList } from "../../model/todoListSlice"
import { useActions, useAppSelector } from "common/hooks/redux_hooks/useAction"
import { todoListSelector } from "../../model/todoListSelectors"
import { asyncAuthActions } from "../../../Login/model/authSlice"
import { isLoggedInSelector } from "common/components/Login/model/authSelectors"

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
            <TodoList title={tl.title} todoListId={tl.id} filter={tl.filter} entityStatus={tl.entityStatus} />
          </div>
        ))}
      </div>
    </>
  )
}

export default TodoListLists
