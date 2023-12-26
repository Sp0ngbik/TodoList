import React from "react"
import style from "./todoList.module.css"
import { useActions, useAppSelector } from "common/hooks/redux_hooks/useAction"
import { T_TaskResponseItems } from "../../api/task_API"
import Task from "../Task/Task"
import EditableSpan from "common/components/EdditableSpan/EditableSpan"
import { T_ResponseStatus } from "app/model/appSlice"
import { asyncTodoList, T_FilterValues, todoListActions } from "../../model/todoListSlice"
import AddNewItem from "common/components/AddNewTodo/AddNewItem"
import { fetchCreateTask } from "../../model/tasksSlice"
import { selectTasksForTodos } from "../../model/tasksSelectors"

type T_TodoListsProps = {
  title: string
  todoListId: string
  filter: T_FilterValues
  entityStatus: T_ResponseStatus
}

export const TodoList: React.FC<T_TodoListsProps> = React.memo(
  ({ title, todoListId, filter, entityStatus }) => {
    const { fetchDeleteTodoList, fetchUpdateTodoListTitle } = useActions(asyncTodoList)
    const { changeTodoListFilterAC } = useActions(todoListActions)
    const tasksData: T_TaskResponseItems[] = useAppSelector(selectTasksForTodos(todoListId, filter))

    const isEntityTodoListLoading = entityStatus === "loading"

    const filterButton = (selectedFilter: T_FilterValues) => {
      return (
        <button
          className={selectedFilter === filter ? style.activeButton : ""}
          onClick={() => {
            changeTodoListFilterAC({ todoListId, filter: selectedFilter })
          }}
        >
          {selectedFilter}
        </button>
      )
    }

    const createTaskHandler = (arg: { title: string }) =>
      fetchCreateTask({ todoListId, title: arg.title })

    return (
      <div className={style.todoListWrapper}>
        <div className={style.todoList}>
          <EditableSpan
            disabled={isEntityTodoListLoading}
            prevTitle={title}
            callbackFunc={(param: { title: string }) =>
              fetchUpdateTodoListTitle({
                todoListId: todoListId,
                title: param.title,
              })
            }
          />
          <button
            onClick={() => fetchDeleteTodoList(todoListId)}
            disabled={isEntityTodoListLoading}
          >
            X
          </button>
        </div>
        <div>
          <AddNewItem callback={createTaskHandler} />
          {tasksData &&
            tasksData.map((el) => (
              <Task
                key={el.id}
                id={el.id}
                title={el.title}
                todoListId={todoListId}
                status={el.status}
                isEntityTodoListLoading={isEntityTodoListLoading}
                entityStatus={el.entityTaskStatus}
              />
            ))}
          <div className={style.buttonsFilterStyle}>
            {filterButton("all")}
            {filterButton("inProgress")}
            {filterButton("completed")}
          </div>
        </div>
      </div>
    )
  },
)
