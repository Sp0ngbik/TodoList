import { T_TodoListCreate, T_TodoListPost, todolist_API } from "../../api/todolist_API"
import { appActions, T_ResponseStatus } from "./app_reducer"
import { localErrorHandler, networkErrorHandler } from "../../utils/errorsHandler"
import { successHandler } from "../../utils/successHandler"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { asyncTasks } from "./tasks_reducer"
import { createAppAsyncThunk } from "../../utils/createAppAsyncThunk"

export type T_FilterValues = "all" | "completed" | "inProgress"

export type T_TodoListInitial = T_TodoListCreate & {
  filter: T_FilterValues
  entityStatus: T_ResponseStatus
}
const initialState: T_TodoListInitial[] = []

const fetchTodoLists = createAppAsyncThunk<{ tlData: T_TodoListCreate[] }, undefined>(
  "todoList/getTodoLists",
  async (arg, { dispatch, rejectWithValue }) => {
    dispatch(appActions.appSetStatusAC({ status: "loading" }))
    try {
      const todoListsData = await todolist_API.getTodoLists()
      successHandler(dispatch, "TodoLists and tasks loaded")
      todoListsData.data.map((el) => dispatch(asyncTasks.fetchTasks(el.id)))
      return { tlData: todoListsData.data }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)
const fetchDeleteTodoList = createAppAsyncThunk<{ todoListId: string }, string>(
  "todoLists/deleteTodoList",
  async (todoListId, { dispatch, rejectWithValue }) => {
    dispatch(appActions.appSetStatusAC({ status: "loading" }))
    try {
      dispatch(
        todoListActions.changeTodoListEntityStatusAC({
          todoListId,
          status: "loading",
        }),
      )
      await todolist_API.deleteTodoList(todoListId)
      successHandler(dispatch, "TodoLists was deleted")
      return { todoListId }
    } catch (e) {
      console.log("s")
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)
export const fetchAddNewTodoList = createAppAsyncThunk<{ newTL: T_TodoListPost }, string>(
  "todoList/createTodoList",
  async (title, { dispatch, rejectWithValue }) => {
    dispatch(appActions.appSetStatusAC({ status: "loading" }))
    try {
      const newTL = await todolist_API.createTodoList(title)
      if (newTL.data.resultCode) {
        return localErrorHandler(dispatch, newTL, rejectWithValue, false)
      } else {
        successHandler(dispatch, "TodoLists was added")
        dispatch(appActions.appSetStatusAC({ status: "succeeded" }))
        return { newTL: newTL.data.data }
      }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)
const fetchUpdateTodoListTitle = createAppAsyncThunk<
  { todoListId: string; newTitleTL: string },
  {
    todoListId: string
    title: string
  }
>("todoList/editTodoListTitle", async ({ todoListId, title }, { dispatch, rejectWithValue }) => {
  try {
    let updateTL = await todolist_API.updateTodoList(todoListId, title)
    if (updateTL.data.resultCode) {
      return localErrorHandler(dispatch, updateTL, rejectWithValue)
    } else {
      successHandler(dispatch, "TodoLists was edited")
      return { todoListId, newTitleTL: title }
    }
  } catch (e) {
    return networkErrorHandler(dispatch, e, rejectWithValue)
  }
})

export const todolistSlice = createSlice({
  name: "todoList",
  initialState,
  reducers: {
    changeTodoListFilterAC: (state, action: PayloadAction<{ todoListId: string; filter: T_FilterValues }>) => {
      const todoList = state.findIndex((el) => el.id === action.payload.todoListId)
      state[todoList].filter = action.payload.filter
    },
    changeTodoListEntityStatusAC: (
      state,
      action: PayloadAction<{
        todoListId: string
        status: T_ResponseStatus
      }>,
    ) => {
      const todoList = state.findIndex((el) => el.id === action.payload.todoListId)
      state[todoList].entityStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        state = action.payload.tlData.map((el) => ({
          ...el,
          entityStatus: "idle",
          filter: "all",
        }))
        return state
      })
      .addCase(fetchDeleteTodoList.fulfilled, (state, action) => {
        const index = state.findIndex((el) => el.id === action.payload.todoListId)
        state.splice(index, 1)
      })
      .addCase(fetchAddNewTodoList.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.newTL.item,
          entityStatus: "idle",
          filter: "all",
        })
      })
      .addCase(fetchUpdateTodoListTitle.fulfilled, (state, action) => {
        const todoList = state.findIndex((el) => el.id === action.payload.todoListId)
        state[todoList].title = action.payload.newTitleTL
      })
  },
})

export const todoList_reducer = todolistSlice.reducer
export const todoListActions = todolistSlice.actions
export const asyncTodoList = {
  fetchTodoLists,
  fetchDeleteTodoList,
  fetchAddNewTodoList,
  fetchUpdateTodoListTitle,
}
