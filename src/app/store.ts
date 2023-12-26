import { configureStore } from "@reduxjs/toolkit"
import { appReducer } from "./model/appSlice"
import { tasksReducer } from "features/TodoListLists/model/tasksSlice"
import { todoListReducer } from "features/TodoListLists/model/todoListSlice"
import { authReducer } from "features/Login/model/authSlice"

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todoList: todoListReducer,
    app: appReducer,
    auth: authReducer,
  },
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

//@ts-ignore
window.store = store
