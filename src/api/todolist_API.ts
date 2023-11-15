import axios from "axios";

export type T_TodoListCreate = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}

export type T_TodoListPost = {
    item: T_TodoListCreate
}

export type  T_TodoListResponse<D = {}> = {
    resultCode: number,
    messages: string[],
    data: D
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '0c1210d9-02a1-4a51-8e24-3745e4974a4e'
    }
}

export const instanceAxios = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})
export const todolist_API = {
    getTodoLists() {
        return instanceAxios.get<T_TodoListCreate[]>('todo-lists')
    },
    createTodoList(title: string) {
        return instanceAxios.post<T_TodoListResponse<T_TodoListPost>>('todo-lists', {title: title})
    },
    deleteTodoList(todoListId: string) {
        return instanceAxios.delete<T_TodoListResponse>(`todo-lists/${todoListId}`)
    },
    updateTodoList(todoListId: string, title: string) {
        return instanceAxios.put<T_TodoListResponse>(`todo-lists/${todoListId}`, {title: title})
    }
}