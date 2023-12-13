import React, { useCallback, useEffect } from "react"
import { useActions, useAppSelector } from "../../hooks/redux_hooks/hooks"
import { todoListSelector } from "../../redux/selectorsHandler"
import { asyncAuthActions, asyncTodoList } from "../../redux/reducers"
import AddNewItem from "../AddNewTodo/AddNewItem"
import { Navigate } from "react-router-dom"
import { TodoList } from "../TodoList/TodoLists"
import style from "./todoLists.module.css"

const TodoListLists = () => {
  const { fetchTodoLists, fetchAddNewTodoList } = useActions(asyncTodoList)
  const { fetchLogout } = useActions(asyncAuthActions)
  useEffect(() => {
    fetchTodoLists()
  }, [fetchTodoLists])
  const todoListsData = useAppSelector(todoListSelector)
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
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
