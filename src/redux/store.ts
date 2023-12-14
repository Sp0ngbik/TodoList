import { app_reducer, authReducer, tasks_reducer, todoList_reducer } from "./reducers"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
  reducer: {
    tasks: tasks_reducer,
    todoList: todoList_reducer,
    app: app_reducer,
    auth: authReducer,
  },
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

//@ts-ignore
window.store = store
