import { T_TodoListCreate, T_TodoListPost, T_TodoListResponse } from "./index"
import { axiosInstance } from "common/utils/axiosInstance"

export const todolist_API = {
  getTodoLists() {
    return axiosInstance.get<T_TodoListCreate[]>("todo-lists")
  },
  createTodoList(title: string) {
    return axiosInstance.post<T_TodoListResponse<T_TodoListPost>>("todo-lists", title)
  },
  deleteTodoList(todoListId: string) {
    return axiosInstance.delete<T_TodoListResponse>(`todo-lists/${todoListId}`)
  },
  updateTodoList(todoListId: string, title: string) {
    return axiosInstance.put<T_TodoListResponse>(`todo-lists/${todoListId}`, {
      title: title,
    })
  },
}
