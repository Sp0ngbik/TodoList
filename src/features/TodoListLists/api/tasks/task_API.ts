import { T_CreateTask, T_TasksCreateResponse, T_TasksResponse, T_UpdateTask } from "./index"
import { axiosInstance } from "common/utils/axiosInstance"

export const task_API = {
  getTask(todolistId: string) {
    return axiosInstance.get<T_TasksCreateResponse>(`todo-lists/${todolistId}/tasks`)
  },
  deleteTask(todolistId: string, taskId: string) {
    return axiosInstance.delete<T_TasksResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, title: string) {
    return axiosInstance.post<T_TasksResponse<T_CreateTask>>(`/todo-lists/${todolistId}/tasks`, {
      title: title,
    })
  },
  updateTask(todolistId: string, taskId: string, model: T_UpdateTask) {
    return axiosInstance.put<T_TasksResponse<T_CreateTask>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`,
      model,
    )
  },
}
