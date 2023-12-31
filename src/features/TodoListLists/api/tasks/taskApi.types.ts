import { TaskPriorities, TasksStatus } from "common/enums/enums"
import { T_ResponseStatus } from "app/types"

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
