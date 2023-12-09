import { AppDispatch } from "../../redux/store"
import { RefObject, useCallback, useState } from "react"
import {
  fetchDeleteTodoList,
  fetchTodoListTitle,
  T_FilterValues,
  TodoListActions,
} from "../../redux/reducers/todoList_reducer"
import { fetchCreateTask } from "../../redux/reducers/tasks_reducer"

export const useTodoListWorker = (dispatch: AppDispatch, todoListId: string) => {
  const [error, setError] = useState(false)

  const removeTodoListId = useCallback(() => {
    dispatch(fetchDeleteTodoList(todoListId))
  }, [todoListId, dispatch])

  const editTodoListTitle = useCallback(
    (title: string) => {
      dispatch(fetchTodoListTitle({ todoListId, title }))
    },
    [todoListId, dispatch],
  )

  const addTask = useCallback(
    (newTitle: RefObject<HTMLInputElement>) => {
      if (newTitle.current) {
        setErrorCallback(false)
        if (newTitle.current.value.trim()) {
          dispatch(fetchCreateTask({ todoListId, title: newTitle.current.value }))
          newTitle.current.value = ""
        } else {
          setErrorCallback(true)
        }
      }
    },
    [todoListId, dispatch],
  )
  const setErrorCallback = (value: boolean) => {
    setError(value)
  }

  const changeFilter = useCallback(
    (filterValue: T_FilterValues) => {
      dispatch(
        TodoListActions.changeTodoListFilterAC({
          todoListId,
          filter: filterValue,
        }),
      )
    },
    [todoListId, dispatch],
  )

  return { removeTodoListId, editTodoListTitle, addTask, changeFilter, error }
}
