import { app_reducer, asyncApp } from "./app_reducer"
import { asyncAuthActions, authReducer } from "./auth_reducer"
import { asyncTasks, tasks_reducer } from "./tasks_reducer"
import { asyncTodoList, todoList_reducer } from "./todoList_reducer"

export { asyncTasks, asyncTodoList, asyncAuthActions, asyncApp }
export { app_reducer, authReducer, tasks_reducer, todoList_reducer }
