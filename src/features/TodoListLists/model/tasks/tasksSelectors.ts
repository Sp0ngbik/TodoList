import { RootState } from "app/store"
import { createSelector } from "@reduxjs/toolkit"
import { TasksStatus } from "common/enums/enums"
import { T_FilterValues } from "features/TodoListLists/model/todolist/todoListSlice"

export const tasks = (state: RootState) => state.tasks
export const selectTasksForTodos = (id: string, filter: T_FilterValues) =>
  createSelector([tasks], (allTasks) => {
    if (filter === "completed") {
      return allTasks[id].filter((task) => task.status === TasksStatus.Completed)
    } else if (filter === "inProgress") {
      return allTasks[id].filter(
        (task) => task.status === TasksStatus.InProgress || task.status === TasksStatus.New,
      )
    } else {
      return allTasks[id]
    }
  })
