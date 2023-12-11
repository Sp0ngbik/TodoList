import React, { useCallback, useEffect } from "react"
import { useActions, useAppSelector } from "../../hooks/redux_hooks/hooks"
import { todoListSelector } from "../../redux/selectorsHandler"
import { asyncTodoList } from "../../redux/reducers/todoList_reducer"
import style from "../../app/app.module.css"
import AddNewTodo from "../AddNewTodo/AddNewTodo"
import { Navigate } from "react-router-dom"
import { asyncAuthActions } from "../../redux/reducers"
import { TodoList } from "../TodoList/TodoLists"

const TodoListLists = () => {
  const { fetchTodoLists } = useActions(asyncTodoList)
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
      <AddNewTodo />
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
