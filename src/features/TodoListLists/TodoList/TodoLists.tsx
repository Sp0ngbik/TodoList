import React from "react"
import style from "features/TodoListLists/TodoList/todoList.module.css"
import AddNewItem from "common/components/AddNewTodo/AddNewItem"
import {
  asyncTodoList,
  T_FilterValues,
  todoListActions,
} from "features/TodoListLists/model/todolist"
import { Task } from "features/TodoListLists/TodoList/Task"
import { EditableSpan } from "common/components/EdditableSpan"
import { useActions, useAppSelector } from "common/hooks/redux_hooks"
import { T_ResponseStatus } from "app/types"
import { T_TaskResponseItems } from "features/TodoListLists/api/tasks"
import { selectTasksForTodos } from "features/TodoListLists/model/tasks/tasksSelectors"
import { fetchCreateTask } from "features/TodoListLists/model/tasks/tasksSlice"

type Props = {
  title: string
  todoListId: string
  filter: T_FilterValues
  entityStatus: T_ResponseStatus
}

export const TodoList: React.FC<Props> = React.memo(
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
