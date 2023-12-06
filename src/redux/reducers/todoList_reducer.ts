import {T_TodoListCreate, todolist_API} from "../../api/todolist_API";
import {T_FilterValues} from "../../app/AppTodoList";
import {fetchTasks} from "./tasks_reducer";
import {appSetStatusAC, T_ResponseStatus} from "./app_reducer";
import {localErrorHandler, networkErrorHandler} from "../../utils/errorsHandler";
import {successHandler} from "../../utils/successHandler";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type T_TodoListInitial = T_TodoListCreate & {
    filter: T_FilterValues
    entityStatus: T_ResponseStatus
}

const initialState: T_TodoListInitial[] = []

export const fetchTodoLists = createAsyncThunk('todoList/getTodoLists', async (arg, {dispatch, rejectWithValue}) => {
    dispatch(appSetStatusAC({status: 'loading'}))
    try {
        const todoListsData = await todolist_API.getTodoLists()
        successHandler(dispatch, 'TodoLists and tasks loaded')
        todoListsData.data.map(el => dispatch(fetchTasks(el.id)))
        return {tlData: todoListsData.data}
    } catch (e) {
        networkErrorHandler(dispatch, e)
        return rejectWithValue(null)
    }
})
export const fetchDeleteTodoList = createAsyncThunk('todoLists/deleteTodoList', async (todoListId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(appSetStatusAC({status: 'loading'}))
    try {
        dispatch(changeTodoListEntityStatusAC({todoListId, status: 'loading'}))
        await todolist_API.deleteTodoList(todoListId)
        successHandler(dispatch, 'TodoLists was deleted')
        return ({todoListId})
    } catch (e) {
        networkErrorHandler(dispatch, e)
        return rejectWithValue(null)
    }
})
export const fetchAddNewTodoList = createAsyncThunk('todoList/createTodoList', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(appSetStatusAC({status: 'loading'}))
    try {
        const newTL = await todolist_API.createTodoList(title)
        if (newTL.data.resultCode) {
            networkErrorHandler(dispatch, newTL.data.messages[0])
            return rejectWithValue(null)
        } else {
            successHandler(dispatch, 'TodoLists was added')
            dispatch(appSetStatusAC({status: 'loading'}))

            return {newTL: newTL.data}
        }
    } catch (e) {
        networkErrorHandler(dispatch, e)
        return rejectWithValue(null)
    }
})
export const fetchTodoListTitle = createAsyncThunk('todoList/editTodoListTitle', async (arg: {
    todoListId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
    try {
        let updateTL = await todolist_API.updateTodoList(arg.todoListId, arg.title)
        if (updateTL.data.resultCode) {
            localErrorHandler(dispatch, updateTL)
            return rejectWithValue(null)
        } else {
            successHandler(dispatch, 'TodoLists was edited')
            return {todoListId: arg.todoListId, newTitleTL: arg.title}
        }
    } catch (e) {
        networkErrorHandler(dispatch, e)
        return rejectWithValue(null)
    }
})


export const todolistSlice = createSlice({
    name: 'todoList',
    initialState,
    reducers: {
        changeTodoListFilterAC: (state, action: PayloadAction<{ todoListId: string, filter: T_FilterValues }>) => {
            const todoList = state.findIndex(el => el.id === action.payload.todoListId)
            state[todoList].filter = action.payload.filter
        },
        changeTodoListEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, status: T_ResponseStatus }>) => {
            const todoList = state.findIndex(el => el.id === action.payload.todoListId)
            state[todoList].entityStatus = action.payload.status
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
            state = action.payload.tlData.map(el => ({...el, entityStatus: 'idle', filter: 'all'}))
            return state
        })
            .addCase(fetchDeleteTodoList.fulfilled, (state, action) => {
            const index = state.findIndex(el => el.id === action.payload.todoListId)
            state.splice(index, 1)
        })
            .addCase(fetchAddNewTodoList.fulfilled, (state, action) => {
            state.unshift({...action.payload.newTL.data.item, entityStatus: 'idle', filter: 'all'})
        })
            .addCase(fetchTodoListTitle.fulfilled, (state, action) => {
            const todoList = state.findIndex(el => el.id === action.payload.todoListId)
            state[todoList].title = action.payload.newTitleTL
        })
    }
})

export const todoList_reducer = todolistSlice.reducer
export const {
    changeTodoListFilterAC,
    changeTodoListEntityStatusAC
} = todolistSlice.actions



