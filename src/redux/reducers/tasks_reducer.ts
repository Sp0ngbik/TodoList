import { AppThunk, RootState} from "../store";
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
import {addNewTodoListAC, deleteTodoListAC, T_CreateTL} from "./todoList_reducer";
import {localErrorHandler, networkErrorHandler} from "../../utils/errorsHandler";
import {successHandler} from "../../utils/successHandler";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";

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

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        getTasksAC: (state, action: PayloadAction<{ todoListId: string, taskData: T_TasksCreateResponse }>) => {
            state[action.payload.todoListId] = action.payload.taskData.items.map(el => ({
                ...el,
                entityTaskStatus: 'idle'
            }))
        },
        createTasksAC: (state, action: PayloadAction<{
            todoListId: string,
            newTask: T_TasksResponse<T_CreateTask>
        }>) => {
            if (state[action.payload.todoListId].length >= 10) {
                state[action.payload.todoListId].pop()
                state[action.payload.todoListId] = [action.payload.newTask.data.item, ...state[action.payload.todoListId]]
            } else {
                state[action.payload.todoListId] = [action.payload.newTask.data.item, ...state[action.payload.todoListId]]
            }
        },
        deleteTaskAC: (state, action: PayloadAction<{ todoListId: string, taskId: string }>) => {
            const index = state[action.payload.todoListId].findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todoListId].splice(index, 1)
        },
        updateTaskStatusAC: (state, action: PayloadAction<{
            todoListId: string,
            taskId: string,
            taskModel: T_PutTask
        }>) => {
            const task = state[action.payload.todoListId].findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todoListId][task] = {...state[action.payload.todoListId][task], ...action.payload.taskModel}
        },
        changeTaskEntityStatusAC: (state, action: PayloadAction<{
            todoListId: string,
            taskId: string,
            status: T_ResponseStatus
        }>) => {
            const task = state[action.payload.todoListId].findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todoListId][task].entityTaskStatus = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addNewTodoListAC, (state, action) => {
            state[action.payload.newTL.data.item.id] = []
        })
        builder.addCase(deleteTodoListAC, (state, action) => {
            delete state[action.payload.todoListId]
        })
    }

})

export const {updateTaskStatusAC, getTasksAC, changeTaskEntityStatusAC, createTasksAC, deleteTaskAC} = taskSlice.actions
export const tasks_reducer = taskSlice.reducer
///////ASYNC
export const getTasksTK = (todoListId: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        const taskData = await task_API.getTask(todoListId)
        dispatch(getTasksAC({todoListId, taskData: taskData.data}))
    } catch (e) {
        networkErrorHandler(dispatch, e)
    }
}

export const createTasksTK = (todoListId: string, title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(appSetStatusAC({status: 'loading'}))
        const newTask = await task_API.createTask(todoListId, title)
        if (newTask.data.resultCode) {
            localErrorHandler(dispatch, newTask)
        } else {
            successHandler(dispatch, 'Task added')
            dispatch(createTasksAC({todoListId, newTask: newTask.data}))
        }
    } catch (e) {
        console.log(e)
        networkErrorHandler(dispatch, e)
    }
}

export const deleteTaskTK = (todoListId: string, taskId: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(appSetStatusAC({status: 'loading'}))
        dispatch(changeTaskEntityStatusAC({todoListId, taskId, status: 'loading'}))
        let deleteTask = await task_API.deleteTask(todoListId, taskId)
        if (deleteTask.data.resultCode) {
            localErrorHandler(dispatch, deleteTask)
        } else {
            dispatch(deleteTaskAC({todoListId, taskId}))
            successHandler(dispatch, 'Task was deleted')
        }
    } catch (e) {
        networkErrorHandler(dispatch, e)

    }
}

export const updateTaskFields = (todoListId: string, taskId: string, newField: T_PutTask): AppThunk => async (dispatch: Dispatch, getState: () => RootState) => {
    const model: T_TaskResponseItems[] = getState().tasks[todoListId]
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
                dispatch(updateTaskStatusAC({todoListId, taskId, taskModel}))
            }
        } catch (e) {
            networkErrorHandler(dispatch, e)
        }
    }
}