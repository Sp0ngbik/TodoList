import { AppThunk} from "../store";
import {T_TodoListCreate, T_TodoListPost, T_TodoListResponse, todolist_API} from "../../api/todolist_API";
import {T_FilterValues} from "../../app/AppTodoList";
import {getTasksTK} from "./tasks_reducer";
import {appSetStatusAC, T_ResponseStatus} from "./app_reducer";
import {localErrorHandler, networkErrorHandler} from "../../utils/errorsHandler";
import {successHandler} from "../../utils/successHandler";
import {createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";

export type T_TodoListInitial = T_TodoListCreate & {
    filter: T_FilterValues
    entityStatus: T_ResponseStatus
}

const initialState: T_TodoListInitial[] = []


export const todolistSlice = createSlice({
    name: 'todoList',
    initialState,
    reducers: {
        getTodoListAC: (state, action: PayloadAction<{ tlData: T_TodoListCreate[] }>) => {
            state = action.payload.tlData.map(el => ({...el, entityStatus: 'idle', filter: 'all'}))
            return state
        },
        deleteTodoListAC: (state, action: PayloadAction<{ todoListId: string }>) => {
            const index = state.findIndex(el => el.id === action.payload.todoListId)
            state.splice(index, 1)
        },
        addNewTodoListAC: (state, action: PayloadAction<{ newTL: T_TodoListResponse<T_TodoListPost> }>) => {
            state.unshift({...action.payload.newTL.data.item, entityStatus: 'idle', filter: 'all'})
        },
        editTodoListTitleAC: (state, action: PayloadAction<{ todoListId: string, newTitleTL: string }>) => {
            const todoList = state.findIndex(el => el.id === action.payload.todoListId)
            state[todoList].title = action.payload.newTitleTL
        },
        changeTodoListFilterAC: (state, action: PayloadAction<{ todoListId: string, filter: T_FilterValues }>) => {
            const todoList = state.findIndex(el => el.id === action.payload.todoListId)
            state[todoList].filter = action.payload.filter
        },
        changeTodoListEntityStatusAC: (state, action: PayloadAction<{
            todoListId: string,
            status: T_ResponseStatus
        }>) => {
            const todoList = state.findIndex(el => el.id === action.payload.todoListId)
            state[todoList].entityStatus = action.payload.status
        }

    }
})

export const todoList_reducer = todolistSlice.reducer
export const {
    getTodoListAC,
    deleteTodoListAC,
    addNewTodoListAC,
    editTodoListTitleAC,
    changeTodoListFilterAC,
    changeTodoListEntityStatusAC
} = todolistSlice.actions

/////ASYNC
export const getTodoListsTK = (): AppThunk => async (dispatch: any) => {
    ///////////////////////////FIX ANY
    try {
        dispatch(appSetStatusAC({status: 'loading'}))
        const tlData = await todolist_API.getTodoLists()
        dispatch(getTodoListAC({tlData: tlData.data}))
        tlData.data.map(el => dispatch(getTasksTK(el.id)))
        successHandler(dispatch, 'TodoLists and tasks loaded')
    } catch (e) {
        networkErrorHandler(dispatch, e)
    }
}

export const deleteTodoListTK = (todoListId: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(appSetStatusAC({status: 'loading'}))
        dispatch(changeTodoListEntityStatusAC({todoListId, status: 'loading'}))
        await todolist_API.deleteTodoList(todoListId)
        dispatch(deleteTodoListAC({todoListId}))
        successHandler(dispatch, 'TodoLists was deleted')
    } catch (e) {
        networkErrorHandler(dispatch, e)
    }
    // dispatch(appSetStatusAC('idle', null))
}

export const addNewTodoListTK = (title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        const newTL = await todolist_API.createTodoList(title)
        if (newTL.data.resultCode) {
            networkErrorHandler(dispatch, newTL.data.messages[0])
        } else {
            dispatch(addNewTodoListAC({newTL: newTL.data}))
            successHandler(dispatch, 'TodoLists was added')
        }
    } catch (e) {
        networkErrorHandler(dispatch, e)
    }
}

export const editTodoListTitleTK = (todoListId: string, title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        let updateTL = await todolist_API.updateTodoList(todoListId, title)
        if (updateTL.data.resultCode) {
            localErrorHandler(dispatch, updateTL)
        } else {
            dispatch(editTodoListTitleAC({todoListId, newTitleTL: title}))
            successHandler(dispatch, 'TodoLists was edited')
        }
    } catch (e) {
        networkErrorHandler(dispatch, e)
    }
}