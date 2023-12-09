import { RootState } from "./store"
import { createSelector } from "@reduxjs/toolkit"

export const todoListSelector = (state: RootState) => state.todoList
export const tasks = (state: RootState) => state.tasks
export const selectTasksForTodos = (id: string) =>
  createSelector([tasks], (allTasks) => {
    return allTasks[id]
  })
