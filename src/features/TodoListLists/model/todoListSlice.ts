import { T_TodoListCreate, T_TodoListPost, todolist_API } from "../api/todolist_API"
import { T_ResponseStatus } from "app/model/appSlice"
import { successHandler } from "common/utils/successHandler"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { asyncTasks } from "./tasksSlice"
import { createAppAsyncThunk } from "common/hooks/redux_hooks/createAppAsyncThunk"
import { ResultCode } from "common/enums/enums"

export type T_FilterValues = "all" | "completed" | "inProgress"

export type T_TodoListInitial = T_TodoListCreate & {
  filter: T_FilterValues
  entityStatus: T_ResponseStatus
}
const initialState: T_TodoListInitial[] = []

export const todolistSlice = createSlice({
  name: "todoList",
  initialState,
  reducers: {
    changeTodoListFilterAC: (
      state,
      action: PayloadAction<{ todoListId: string; filter: T_FilterValues }>,
    ) => {
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

const fetchTodoLists = createAppAsyncThunk<{ tlData: T_TodoListCreate[] }, undefined>(
  `${todolistSlice.name}/getTodoLists`,
  async (arg, { dispatch, rejectWithValue }) => {
    const response = await todolist_API.getTodoLists()
    successHandler(dispatch, "TodoLists and tasks loaded")
    response.data.map((el) => dispatch(asyncTasks.fetchTasks(el.id)))
    return { tlData: response.data }
  },
)
const fetchDeleteTodoList = createAppAsyncThunk<{ todoListId: string }, string>(
  `${todolistSlice.name}/deleteTodoList`,
  async (todoListId, { dispatch, rejectWithValue }) => {
    dispatch(
      todoListActions.changeTodoListEntityStatusAC({
        todoListId,
        status: "loading",
      }),
    )
    const response = await todolist_API.deleteTodoList(todoListId)
    if (response.data.resultCode === ResultCode.success) {
      successHandler(dispatch, "TodoLists was deleted")
      return { todoListId }
    } else {
      return rejectWithValue(response.data)
    }
  },
)
export const fetchAddNewTodoList = createAppAsyncThunk<{ newTL: T_TodoListPost }, string>(
  `${todolistSlice.name}/createTodoList`,
  async (title, { dispatch, rejectWithValue }) => {
    const response = await todolist_API.createTodoList(title)
    if (response.data.resultCode === ResultCode.success) {
      successHandler(dispatch, "TodoLists was added")
      return { newTL: response.data.data }
    } else {
      return rejectWithValue(response.data)
    }
  },
)
const fetchUpdateTodoListTitle = createAppAsyncThunk<
  { todoListId: string; newTitleTL: string },
  {
    todoListId: string
    title: string
  }
>(
  `${todolistSlice.name}/editTodoListTitle`,
  async ({ todoListId, title }, { dispatch, rejectWithValue }) => {
    let response = await todolist_API.updateTodoList(todoListId, title)
    if (response.data.resultCode === ResultCode.success) {
      successHandler(dispatch, "TodoLists was edited")
      return { todoListId, newTitleTL: title }
    } else {
      return rejectWithValue(response.data)
    }
  },
)

export const todoListReducer = todolistSlice.reducer
export const todoListActions = todolistSlice.actions
export const asyncTodoList = {
  fetchTodoLists,
  fetchDeleteTodoList,
  fetchAddNewTodoList,
  fetchUpdateTodoListTitle,
}
