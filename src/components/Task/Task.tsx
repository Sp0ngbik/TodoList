import React, { FC } from "react"
import { useActions } from "../../hooks/redux_hooks/hooks"
import style from "./tasks.module.css"
import { TasksStatus } from "../../api/task_API"
import EditableSpan from "../EdditableSpan/EditableSpan"
import { T_ResponseStatus } from "../../redux/reducers/app_reducer"
import { asyncTasks } from "../../redux/reducers"

type T_Task = {
  id: string
  title: string
  todoListId: string
  status: TasksStatus
  entityStatus: T_ResponseStatus
}

const Task: FC<T_Task> = ({ title, id, todoListId, status, entityStatus }) => {
  const { fetchUpdateTaskField, fetchDeleteTask } = useActions(asyncTasks)
  const isTaskDisabled = entityStatus === "loading"
  return (
    <div key={crypto.randomUUID()}>
      <div className={style.task_wrapper}>
        <input
          disabled={isTaskDisabled}
          checked={status === TasksStatus.Completed}
          onChange={(e) =>
            fetchUpdateTaskField({
              todoListId,
              taskId: id,
              newField: {
                status: e.currentTarget.checked ? TasksStatus.Completed : TasksStatus.InProgress,
              },
            })
          }
          type="checkbox"
        />
        <EditableSpan
          disabled={isTaskDisabled}
          callbackFunc={(newField: { title: string }) => fetchUpdateTaskField({ todoListId, taskId: id, newField })}
          prevTitle={title}
        />
        <button
          onClick={() => {
            fetchDeleteTask({ todoListId, taskId: id })
          }}
          disabled={isTaskDisabled}
        >
          X
        </button>
      </div>
    </div>
  )
}

export default Task
