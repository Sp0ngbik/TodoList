import {AppDispatch, AppThunk, RootState} from "../store";
import {
    T_CreateTask,
    T_TaskResponseItems,
    T_TasksCreateResponse,
    T_TasksResponse,
    T_UpdateTask,
    task_API,
    TasksStatus
} from "../../api/task_API";
import {appSetStatusAC, T_ResponseStatus} from "./app_reducer";
import {T_CreateTL} from "./todoList_reducer";
import {localErrorHandler, networkErrorHandler} from "../../utils/errorsHandler";
import {successHandler} from "../../utils/successHandler";

type T_PutTask = {
    title?: string
    description?: string,
    status?: TasksStatus,
    deadline?: string,
    priority?: number,
    startDate?: string
}

export type T_TasksReducer = {
    [todoListId: string]: T_TaskResponseItems[]
}
const initialState: T_TasksReducer = {}
type T_GetTasks = ReturnType<typeof getTasksAC>
type T_CreateTasks = ReturnType<typeof createTasksAC>
type T_DeleteTask = ReturnType<typeof deleteTaskAC>
type T_UpdateTaskStatusAC = ReturnType<typeof updateTaskStatusAC>
type T_ChangeTaskEntityStatusAC = ReturnType<typeof changeTaskEntityStatusAC>
export type T_MainTasks =
    T_GetTasks
    | T_CreateTL
    | T_DeleteTask
    | T_CreateTasks
    | T_UpdateTaskStatusAC
    | T_ChangeTaskEntityStatusAC


export const tasks_reducer = (state = initialState, action: T_MainTasks) => {
    switch (action.type) {
        case "GET_TASKS": {
            return {...state, [action.todoListId]: action.taskData.items.map(el => ({...el, entityTaskStatus: 'idle'}))}
        }
        case "CREATE_TASK": {
            if (state[action.todoListId].length >= 10) {
                state[action.todoListId].pop()
                return {...state, [action.todoListId]: [action.newTask.data.item, ...state[action.todoListId]]}
            }
            return {...state, [action.todoListId]: [action.newTask.data.item, ...state[action.todoListId]]}
        }
        case "DELETE_TASK": {
            return {...state, [action.todoListId]: state[action.todoListId].filter(el => el.id !== action.taskId)}
        }
        case "UPDATED_TASK": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(el => el.id === action.taskId ? {
                    ...el,
                    ...action.taskModel
                } : el)
            }
        }
        case "CHANGE_TASK_ENTITY_STATUS": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(el => el.id === action.taskId ? {
                    ...el,
                    entityTaskStatus: action.status
                } : el)
            }
        }
        case "ADD_TODOLIST": {
            return {...state, [action.newTL.data.item.id]: []}
        }

        default:
            return state
    }
}


////////SYNC
export const getTasksAC = (todoListId: string, taskData: T_TasksCreateResponse) => {
    return {type: 'GET_TASKS', todoListId, taskData} as const
}
const createTasksAC = (todoListId: string, newTask: T_TasksResponse<T_CreateTask>) => {
    return {type: 'CREATE_TASK', todoListId, newTask} as const
}
export const deleteTaskAC = (todoListId: string, taskId: string) => {
    return {type: "DELETE_TASK", todoListId, taskId} as const
}
export const updateTaskStatusAC = (todoListId: string, taskId: string, taskModel: T_PutTask) => {
    return {type: 'UPDATED_TASK', todoListId, taskId, taskModel} as const
}
const changeTaskEntityStatusAC = (todoListId: string, taskId: string, status: T_ResponseStatus) => {
    return {type: 'CHANGE_TASK_ENTITY_STATUS', todoListId, taskId, status} as const
}
///////ASYNC
export const getTasksTK = (todoListId: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        const taskData = await task_API.getTask(todoListId)
        dispatch(getTasksAC(todoListId, taskData.data))
    } catch (e) {
        networkErrorHandler(dispatch, e)
    }
}

export const createTasksTK = (todoListId: string, title: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(appSetStatusAC('loading'))
        const newTask = await task_API.createTask(todoListId, title)
        if (newTask.data.resultCode) {
            localErrorHandler(dispatch, newTask)
        } else {
            successHandler(dispatch, 'Task added')
            dispatch(createTasksAC(todoListId, newTask.data))
        }
    } catch (e) {
        console.log(e)
        networkErrorHandler(dispatch, e)
    }
}

export const deleteTaskTK = (todoListId: string, taskId: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(appSetStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC(todoListId, taskId, 'loading'))
        let deleteTask = await task_API.deleteTask(todoListId, taskId)
        if (deleteTask.data.resultCode) {
            localErrorHandler(dispatch, deleteTask)
        } else {
            dispatch(deleteTaskAC(todoListId, taskId))
            successHandler(dispatch, 'Task was deleted')
        }
    } catch (e) {
        networkErrorHandler(dispatch, e)

    }
}

export const updateTaskFields = (todoListId: string, taskId: string, newField: T_PutTask): AppThunk => async (dispatch: AppDispatch, getState: () => RootState) => {
    const model: T_TaskResponseItems[] = getState().tasks_reducer[todoListId]
    let task = model.find(el => el.id === taskId)
    if (task) {
        const taskModel: T_UpdateTask = {
            title: task.title,
            description: task.description,
            status: task.status,
            deadline: task.deadLine,
            priority: task.priority,
            startDate: task.startDate,
            completed: false,
            ...newField
        }
        try {
            let newTask = await task_API.updateTask(todoListId, taskId, taskModel)
            if (newTask.data.resultCode) {
                localErrorHandler(dispatch, newTask)
            } else {
                successHandler(dispatch, 'Task was updated')
                dispatch(updateTaskStatusAC(todoListId, taskId, taskModel))
            }
        } catch (e) {
            networkErrorHandler(dispatch, e)
        }
    }
}