import { T_CreateTask, T_TaskResponseItems, T_UpdateTask, task_API } from "../api/task_API"
import { T_ResponseStatus } from "app/model/appSlice"
import { successHandler } from "common/utils/successHandler"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { asyncTodoList } from "./todoListSlice"
import { createAppAsyncThunk } from "common/hooks/redux_hooks/createAppAsyncThunk"
import { ResultCode, TasksStatus } from "common/enums/enums"

type T_PutTask = {
  title?: string
  description?: string
  status?: TasksStatus
  deadline?: string
  priority?: number
  startDate?: string
}

export type T_TasksReducer = {
  [todoListId: string]: T_TaskResponseItems[]
}
const initialState: T_TasksReducer = {}

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskEntityStatusAC: (
      state,
      action: PayloadAction<{
        todoListId: string
        taskId: string
        status: T_ResponseStatus
      }>,
    ) => {
      const task = state[action.payload.todoListId].findIndex(
        (el) => el.id === action.payload.taskId,
      )
      state[action.payload.todoListId][task].entityTaskStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodoList.fetchAddNewTodoList.fulfilled, (state, action) => {
        state[action.payload.newTL.item.id] = []
      })
      .addCase(asyncTodoList.fetchDeleteTodoList.fulfilled, (state, action) => {
        delete state[action.payload.todoListId]
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todoListId] = action.payload.tasks.map((el) => ({
          ...el,
          entityTaskStatus: "idle",
        }))
      })
      .addCase(fetchCreateTask.fulfilled, (state, action) => {
        if (state[action.payload.todoListId].length >= 10) {
          state[action.payload.todoListId].pop()
          state[action.payload.todoListId] = [
            action.payload.newTask.item,
            ...state[action.payload.todoListId],
          ]
        } else {
          state[action.payload.todoListId] = [
            action.payload.newTask.item,
            ...state[action.payload.todoListId],
          ]
        }
      })
      .addCase(fetchDeleteTask.fulfilled, (state, action) => {
        const index = state[action.payload.todoListId].findIndex(
          (el) => el.id === action.payload.taskId,
        )
        state[action.payload.todoListId].splice(index, 1)
      })
      .addCase(fetchUpdateTaskField.fulfilled, (state, action) => {
        const task = state[action.payload.todoListId].findIndex(
          (el) => el.id === action.payload.taskId,
        )
        state[action.payload.todoListId][task] = {
          ...state[action.payload.todoListId][task],
          ...action.payload.newField,
        }
      })
  },
})
const fetchTasks = createAppAsyncThunk<
  { tasks: T_TaskResponseItems[]; todoListId: string },
  string
>(`${taskSlice.name}/getTasks`, async (todoListId, { dispatch, rejectWithValue }) => {
  const tasksData = await task_API.getTask(todoListId)
  const tasks = tasksData.data.items
  return { tasks, todoListId }
})

export const fetchCreateTask = createAppAsyncThunk<
  { todoListId: string; newTask: T_CreateTask },
  { todoListId: string; title: string }
>(`${taskSlice.name}/createTask`, async ({ todoListId, title }, { dispatch, rejectWithValue }) => {
  const response = await task_API.createTask(todoListId, title)
  if (response.data.resultCode === ResultCode.success) {
    successHandler(dispatch, "Task added")
    return { todoListId, newTask: response.data.data }
  } else {
    return rejectWithValue(response.data)
  }
})

const fetchDeleteTask = createAppAsyncThunk<
  { todoListId: string; taskId: string },
  { todoListId: string; taskId: string }
>(`${taskSlice.name}/deleteTask`, async ({ todoListId, taskId }, { dispatch, rejectWithValue }) => {
  dispatch(
    tasksActions.changeTaskEntityStatusAC({
      todoListId: todoListId,
      taskId: taskId,
      status: "loading",
    }),
  )
  let response = await task_API.deleteTask(todoListId, taskId)
  if (response.data.resultCode === ResultCode.success) {
    successHandler(dispatch, "Task was deleted")
    return { todoListId, taskId }
  } else {
    return rejectWithValue(response.data)
  }
})
const fetchUpdateTaskField = createAppAsyncThunk<
  { todoListId: string; taskId: string; newField: T_PutTask }, //T_UpdateTask - T_PutTask - похожи fix ------
  { todoListId: string; taskId: string; newField: T_PutTask }
>(`${taskSlice.name}/updateField`, async (arg, { dispatch, getState, rejectWithValue }) => {
  const state = getState()
  const model: T_TaskResponseItems[] = state.tasks[arg.todoListId]
  let task = model.find((el) => el.id === arg.taskId)
  if (task) {
    const taskModel: T_UpdateTask = {
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadLine,
      priority: task.priority,
      startDate: task.startDate,
      completed: false,
      ...arg.newField,
    }
    let response = await task_API.updateTask(arg.todoListId, arg.taskId, taskModel)
    if (response.data.resultCode === ResultCode.success) {
      successHandler(dispatch, "Task was updated")
      return arg
    } else {
      return rejectWithValue(response.data)
    }
  }
  return rejectWithValue(null)
})
export const tasksActions = taskSlice.actions
export const tasksReducer = taskSlice.reducer
export const asyncTasks = { fetchTasks, fetchCreateTask, fetchDeleteTask, fetchUpdateTaskField }
