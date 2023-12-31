import React, { FC } from "react"
import style from "features/TodoListLists/TodoList/Task/tasks.module.css"
import { TasksStatus } from "common/enums/enums"
import { asyncTasks } from "features/TodoListLists/model/tasks/tasksSlice"
import { EditableSpan } from "common/components/EdditableSpan"
import { useActions } from "common/hooks/redux_hooks"
import { T_ResponseStatus } from "app/types"

type Props = {
  id: string
  title: string
  todoListId: string
  status: TasksStatus
  entityStatus: T_ResponseStatus
  isEntityTodoListLoading: boolean
}

export const Task: FC<Props> = ({
  title,
  id,
  todoListId,
  status,
  entityStatus,
  isEntityTodoListLoading,
}) => {
  const { fetchUpdateTaskField, fetchDeleteTask } = useActions(asyncTasks)
  const isTaskDisabled = entityStatus === "loading"
  return (
    <div key={crypto.randomUUID()}>
      <div className={style.task_wrapper}>
        <input
          disabled={isTaskDisabled || isEntityTodoListLoading}
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
          disabled={isTaskDisabled || isEntityTodoListLoading}
          callbackFunc={(newField: { title: string }) =>
            fetchUpdateTaskField({ todoListId, taskId: id, newField })
          }
          prevTitle={title}
        />
        <button
          onClick={() => {
            fetchDeleteTask({ todoListId, taskId: id })
          }}
          disabled={isTaskDisabled || isEntityTodoListLoading}
        >
          X
        </button>
      </div>
    </div>
  )
}
