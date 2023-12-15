import { RootState } from "app/store"
import { createSelector } from "@reduxjs/toolkit"

export const tasks = (state: RootState) => state.tasks
export const selectTasksForTodos = (id: string) =>
  createSelector([tasks], (allTasks) => {
    return allTasks[id]
  })
