import { tasks_reducer } from "./reducers/tasks_reducer"
import { todoList_reducer } from "./reducers/todoList_reducer"
import { app_reducer } from "./reducers/app_reducer"
import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "./reducers/auth_reducer"

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
// export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

//@ts-ignore
window.store = store
