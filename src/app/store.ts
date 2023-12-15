import { configureStore } from "@reduxjs/toolkit"
import { tasksReducer } from "common/components/TodoListLists/model/tasksSlice"
import { todoListReducer } from "common/components/TodoListLists/model/todoListSlice"
import { appReducer } from "./model/appSlice"
import { authReducer } from "common/components/Login/model/authSlice"

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
