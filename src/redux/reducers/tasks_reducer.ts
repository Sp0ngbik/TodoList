import {AppDispatch, AppThunk} from "../store";
import {
    T_CreateTask,
    T_TaskResponseItems,
    T_TasksCreateResponse,
    T_TasksResponse,
    T_UpdateTask,
    task_API,
    TasksStatus
} from "../../api/task_API";
import {AxiosResponse} from "axios";


export type T_TasksReducer = {
    [todoListId: string]: T_TaskResponseItems[]
}
const initialState: T_TasksReducer = {}
type T_GetTasks = ReturnType<typeof getTasksAC>
type T_CreateTasks = ReturnType<typeof createTasksAC>
type T_DeleteTask = ReturnType<typeof deleteTaskAC>
type T_UpdateTaskTitleAC = ReturnType<typeof updateTaskStatusAC>
type T_UpdateTaskStatusAC = ReturnType<typeof updateTaskTitleAC>
export type T_MainTasks = T_GetTasks | T_CreateTasks | T_DeleteTask | T_UpdateTaskStatusAC | T_UpdateTaskTitleAC

export const tasks_reducer = (state = initialState, action: T_MainTasks) => {
    switch (action.type) {
        case "GET_TASKS": {
            return {...state, [action.todoListId]: action.taskData.data.items}
        }
        case "CREATE_TASK": {
            return {...state, [action.todoListId]: [action.newTask.data.data.item, ...state[action.todoListId]]}
        }
        case "DELETE_TASK": {
            return {...state, [action.todoListId]: state[action.todoListId].filter(el => el.id !== action.taskId)}
        }
        case "UPDATED_TASK": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(el => el.id === action.taskId ? {
                    ...el,
                    status: action.status
                } : el)
            }
        }
        default:
            return state
    }
}


////////SYNC
const getTasksAC = (todoListId: string, taskData: AxiosResponse<T_TasksCreateResponse>) => {
    return {type: 'GET_TASKS', todoListId, taskData} as const
}
const createTasksAC = (todoListId: string, newTask: AxiosResponse<T_TasksResponse<T_CreateTask>>) => {
    return {type: 'CREATE_TASK', todoListId, newTask} as const
}
const deleteTaskAC = (todoListId: string, taskId: string) => {
    return {type: "DELETE_TASK", todoListId, taskId} as const
}
const updateTaskStatusAC = (todoListId: string, taskId: string, status: TasksStatus) => {
    return {type: 'UPDATED_TASK', todoListId, taskId, status} as const
}
const updateTaskTitleAC = (todoListId: string, taskId: string, title: any) => {
    return {type: "UPDATE_TASK_TITLE", todoListId, taskId, title} as const
}

///////ASYNC
export const getTasksTK = (todoListId: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        const taskData = await task_API.getTask(todoListId)
        dispatch(getTasksAC(todoListId, taskData))
    } catch (e) {
        console.log(e)
    }
}

export const createTasksTK = (todoListId: string, title: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        const newTask = await task_API.createTask(todoListId, title)
        dispatch(createTasksAC(todoListId, newTask))
    } catch (e) {
        console.log(e)
    }
}

export const deleteTaskTK = (todoListId: string, taskId: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        await task_API.deleteTask(todoListId, taskId)
        dispatch(deleteTaskAC(todoListId, taskId))
    } catch (e) {
        console.log(e)
    }
}

export const updateTaskFields = (todoListId: string, taskId: string, status: TasksStatus, title: string): AppThunk => async (dispatch: AppDispatch) => {
    const taskModel: T_UpdateTask = {
        title: title,
        completed: false,
        priority: 2,
        startDate: '',
        status: status,
        deadline: '',
        description: ''
    }
    try {
        let newTask = await task_API.updateTask(todoListId, taskId, taskModel)
        dispatch(updateTaskStatusAC(todoListId, taskId, newTask.data.data.item.status))
    } catch (e) {
        console.log(e)
    }
}

export const updateTaskTitleTK = (todoListId: string, taskId: string, newTitle: string): AppThunk => async (dispatch: AppDispatch) => {
    console.log('s')
    const taskModel: T_UpdateTask = {
        title: newTitle,
        description: '',
        status: TasksStatus.New,
        deadline: '',
        startDate: '',
        priority: 0,
        completed: false
    }
    try {
        let newTask = await task_API.updateTask(todoListId, taskId, taskModel)
        dispatch(updateTaskTitleAC(todoListId, taskId, newTask.data.data.item.title))
    } catch (e) {
        console.log(e)
    }
}