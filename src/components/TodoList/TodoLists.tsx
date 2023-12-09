import React, { RefObject, useRef } from "react"
import style from "./todoList.module.css"
import { useAppDispatch, useAppSelector } from "../../hooks/redux_hooks/hooks"
import { T_TaskResponseItems, TasksStatus } from "../../api/task_API"
import Task from "../Task/Task"
import EditableSpan from "../EdditableSpan/EditableSpan"
import { T_ResponseStatus } from "../../redux/reducers/app_reducer"
import { selectTasksForTodos } from "../../redux/selectorsHandler"
import { useTodoListWorker } from "../../hooks/workers_hooks/useTodoListWorker"
import { T_FilterValues } from "../../redux/reducers/todoList_reducer"

type T_TodoListsProps = {
  title: string
  todoListId: string
  filter: T_FilterValues
  entityStatus: T_ResponseStatus
}

export const TodoLists: React.FC<T_TodoListsProps> = React.memo(
  ({ title, todoListId, filter, entityStatus }) => {
    const dispatch = useAppDispatch()
    const tasksData: T_TaskResponseItems[] = useAppSelector(selectTasksForTodos(todoListId))
    const newTitle: RefObject<HTMLInputElement> = useRef(null)

    const { removeTodoListId, editTodoListTitle, addTask, changeFilter, error } = useTodoListWorker(
      dispatch,
      todoListId,
    )

    const filterTasksData = () => {
      if (filter === "completed") {
        return tasksData.filter((task) => task.status === TasksStatus.Completed)
      } else if (filter === "inProgress") {
        return tasksData.filter(
          (task) => task.status === TasksStatus.InProgress || task.status === TasksStatus.New,
        )
      } else {
        return tasksData
      }
    }
    const isEntityTodoListLoading = entityStatus === "loading"

    return (
      <div className={style.todoListWrapper}>
        <div className={style.todoList}>
          <EditableSpan
            disabled={isEntityTodoListLoading}
            prevTitle={title}
            callbackFunc={editTodoListTitle}
          />
          <button onClick={removeTodoListId} disabled={isEntityTodoListLoading}>
            X
          </button>
        </div>
        <div>
          <div className={style.addTaskStyle}>
            <input ref={newTitle} className={error ? style.error : ""} />
            <button onClick={() => addTask(newTitle)} disabled={isEntityTodoListLoading}>
              +
            </button>
            {error && <div>Wrong value</div>}
          </div>
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
                changeFilter("all")
              }}
            >
              All
            </button>
            <button
              className={filter === "completed" ? style.activeButton : ""}
              onClick={() => {
                changeFilter("completed")
              }}
            >
              Completed
            </button>
            <button
              className={filter === "inProgress" ? style.activeButton : ""}
              onClick={() => {
                changeFilter("inProgress")
              }}
            >
              InProgress
            </button>
          </div>
        </div>
      </div>
    )
  },
)
