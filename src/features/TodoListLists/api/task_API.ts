import { instanceAxios } from "./todolist_API"
import { T_ResponseStatus } from "app/model/appSlice"
import { TaskPriorities, TasksStatus } from "common/enums/enums"

export type T_TaskResponseItems = {
  description: string
  title: string
  status: TasksStatus
  priority: number
  startDate: string
  deadLine: string
  id: string
  todoListId: string
  order: number
  addedDate: string
  entityTaskStatus: T_ResponseStatus
}

export type T_UpdateTask = {
  title: string
  description: string
  completed: boolean
  status: TasksStatus
  priority: TaskPriorities
  startDate: string
  deadline: string
}

export type T_TasksCreateResponse = {
  items: T_TaskResponseItems[]
  error: string | null
  totalCount: number
}

export type T_CreateTask = {
  item: T_TaskResponseItems
  resultCode: number
  messages: string | []
}

export type T_TasksResponse<D = {}> = {
  resultCode: number
  messages: string[]
  data: D
}

export const task_API = {
  getTask(todolistId: string) {
    return instanceAxios.get<T_TasksCreateResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instanceAxios.delete<T_TasksResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, title: string) {
    return instanceAxios.post<T_TasksResponse<T_CreateTask>>(`/todo-lists/${todolistId}/tasks`, {
      title: title,
    })
  },
  updateTask(todolistId: string, taskId: string, model: T_UpdateTask) {
    return instanceAxios.put<T_TasksResponse<T_CreateTask>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`,
      model,
    )
  },
}
