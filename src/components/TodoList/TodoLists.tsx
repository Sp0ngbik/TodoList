import React from "react"
import style from "./todoList.module.css"
import { useActions, useAppSelector } from "../../hooks/redux_hooks/hooks"
import { T_TaskResponseItems, TasksStatus } from "../../api/task_API"
import Task from "../Task/Task"
import EditableSpan from "../EdditableSpan/EditableSpan"
import { T_ResponseStatus } from "../../redux/reducers/app_reducer"
import { selectTasksForTodos } from "../../redux/selectorsHandler"
import { asyncTodoList, T_FilterValues, TodoListActions } from "../../redux/reducers/todoList_reducer"
import { asyncTasks } from "../../redux/reducers"
import { useFormik } from "formik"

type T_TodoListsProps = {
  title: string
  todoListId: string
  filter: T_FilterValues
  entityStatus: T_ResponseStatus
}

export const TodoList: React.FC<T_TodoListsProps> = React.memo(({ title, todoListId, filter, entityStatus }) => {
  const { fetchTodoListTitle, fetchDeleteTodoList } = useActions(asyncTodoList)
  const { fetchCreateTask } = useActions(asyncTasks)
  const tasksData: T_TaskResponseItems[] = useAppSelector(selectTasksForTodos(todoListId))

  const filterTasksData = () => {
    if (filter === "completed") {
      return tasksData.filter((task) => task.status === TasksStatus.Completed)
    } else if (filter === "inProgress") {
      return tasksData.filter((task) => task.status === TasksStatus.InProgress || task.status === TasksStatus.New)
    } else {
      return tasksData
    }
  }
  const isEntityTodoListLoading = entityStatus === "loading"

  const tasksFormik = useFormik({
    initialValues: {
      newTitle: "",
    },
    validate: (values) => {
      if (values.newTitle.trim().length <= 0) {
        return { newTitle: "Required" }
      }
    },
    onSubmit: (values) => {
      fetchCreateTask({ todoListId, title: values.newTitle })
    },
  })

  return (
    <div className={style.todoListWrapper}>
      <div className={style.todoList}>
        <EditableSpan
          disabled={isEntityTodoListLoading}
          prevTitle={title}
          callbackFunc={(param: { title: string }) =>
            fetchTodoListTitle({
              todoListId: todoListId,
              title: param.title,
            })
          }
        />
        <button onClick={() => fetchDeleteTodoList(todoListId)} disabled={isEntityTodoListLoading}>
          X
        </button>
      </div>
      <div>
        <form onSubmit={tasksFormik.handleSubmit} className={style.addTaskStyle}>
          <input {...tasksFormik.getFieldProps("newTitle")} />
          <button type="submit" disabled={isEntityTodoListLoading}>
            +
          </button>
        </form>
        {tasksData &&
          filterTasksData().map((el) => (
            <Task
              key={el.id}
              id={el.id}
              title={el.title}
              todoListId={todoListId}
              status={el.status}
              entityStatus={el.entityTaskStatus}
            />
          ))}
        <div className={style.buttonsFilterStyle}>
          <button
            className={filter === "all" ? style.activeButton : ""}
            onClick={() => {
              TodoListActions.changeTodoListFilterAC({
                todoListId: todoListId,
                filter: "all",
              })
            }}
          >
            All
          </button>
          <button
            className={filter === "completed" ? style.activeButton : ""}
            onClick={() => {
              TodoListActions.changeTodoListFilterAC({
                todoListId: todoListId,
                filter: "completed",
              })
            }}
          >
            Completed
          </button>
          <button
            className={filter === "inProgress" ? style.activeButton : ""}
            onClick={() => {
              TodoListActions.changeTodoListFilterAC({
                todoListId: todoListId,
                filter: "inProgress",
              })
            }}
          >
            InProgress
          </button>
        </div>
      </div>
    </div>
  )
})
