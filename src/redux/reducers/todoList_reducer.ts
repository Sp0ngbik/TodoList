import {AppDispatch, AppThunk} from "../store";
import {T_TodoListCreate, T_TodoListPost, T_TodoListResponse, todolist_API} from "../../api/todolist_API";
import {T_FilterValues} from "../../app/AppTodoList";
import {getTasksTK} from "./tasks_reducer";

export type T_TodoListInitial = {
    filter: T_FilterValues
} & T_TodoListCreate

const initialState: T_TodoListInitial[] = []

type T_GetTL = ReturnType<typeof getTodoListAC>
type T_DeleteTL = ReturnType<typeof deleteTodoListAC>
export type T_CreateTL = ReturnType<typeof addNewTodoListAC>
type T_ChangeTitleTL = ReturnType<typeof editTodoListTitleAC>
type T_ChangeFilterTL = ReturnType<typeof changeTodoListFilterAC>
export type T_MainTL = T_GetTL | T_DeleteTL | T_CreateTL | T_ChangeTitleTL | T_ChangeFilterTL

export const todoList_reducer = (state = initialState, action: T_MainTL) => {
    switch (action.type) {
        case "GET_TODOLIST": {
            return action.tlData.map(el => ({...el, filter: 'all'}))
        }
        case "DELETE_TODOLIST": {
            return state.filter(el => el.id !== action.todoListId)
        }
        case 'ADD_TODOLIST': {
            return [...state, action.newTL.data.item]
        }
        case "CHANGE_TODOLIST_TITLE": {
            return state.map(el => el.id === action.todoListId ? {...el, title: action.newTitleTL} : el)
        }
        case "CHANGE_TODOLIST_FILTER": {
            return state.map(el => el.id === action.todoListId ? {...el, filter: action.filter} : el)
        }
        default:
            return state
    }
}

//////SYNC
export const getTodoListAC = (tlData: T_TodoListCreate[]) => {
    return {type: 'GET_TODOLIST', tlData} as const
}

const deleteTodoListAC = (todoListId: string) => {
    return {type: 'DELETE_TODOLIST', todoListId} as const
}

const addNewTodoListAC = (newTL: T_TodoListResponse<T_TodoListPost>) => {
    return {type: 'ADD_TODOLIST', newTL} as const
}

const editTodoListTitleAC = (todoListId: string, newTitleTL: string) => {
    return {type: 'CHANGE_TODOLIST_TITLE', todoListId, newTitleTL} as const
}

export const changeTodoListFilterAC = (todoListId: string, filter: T_FilterValues) => {
    return {type: 'CHANGE_TODOLIST_FILTER', todoListId, filter} as const
}
/////ASYNC
export const getTodoListsTK = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
        const tlData = await todolist_API.getTodoLists()
        dispatch(getTodoListAC(tlData.data))
        tlData.data.map(el => dispatch(getTasksTK(el.id)))
    } catch (e) {
        console.log(e)
    }
}

export const deleteTodoListTK = (todoListId: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        await todolist_API.deleteTodoList(todoListId)
        dispatch(deleteTodoListAC(todoListId))

    } catch (e) {
        console.log(e)
    }
}

export const addNewTodoListTK = (title: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        const newTL = await todolist_API.createTodoList(title)
        dispatch(addNewTodoListAC(newTL.data))
    } catch (e) {
        console.log(e)
    }
}

export const editTodoListTitleTK = (todoListId: string, title: string): AppThunk => async (dispatch: AppDispatch) => {
    try {
        await todolist_API.updateTodoList(todoListId, title)
        dispatch(editTodoListTitleAC(todoListId, title))
    } catch (e) {
        console.log(e)
    }
}