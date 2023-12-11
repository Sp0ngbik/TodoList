import { RootState } from "../store"
import { T_TaskResponseItems, T_UpdateTask, task_API, TasksStatus } from "../../api/task_API"
import { AppActions, T_ResponseStatus } from "./app_reducer"
import { localErrorHandler, networkErrorHandler } from "../../utils/errorsHandler"
import { successHandler } from "../../utils/successHandler"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { asyncTodoList } from "./todoList_reducer"

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

const fetchTasks = createAsyncThunk("tasks/getTasks", async (todoListId: string, thunkAPI) => {
  try {
    const tasksData = await task_API.getTask(todoListId)
    const tasks = tasksData.data.items
    return { tasks, todoListId }
  } catch (e) {
    networkErrorHandler(thunkAPI.dispatch, e)
    return thunkAPI.rejectWithValue(null)
  }
})

const fetchCreateTask = createAsyncThunk(
  "tasks/createTask",
  async (
    arg: {
      todoListId: string
      title: string
    },
    thunkAPI,
  ) => {
    thunkAPI.dispatch(AppActions.appSetStatusAC({ status: "loading" }))
    try {
      const newTask = await task_API.createTask(arg.todoListId, arg.title)
      if (newTask.data.resultCode) {
        localErrorHandler(thunkAPI.dispatch, newTask)
        return thunkAPI.rejectWithValue(null)
      } else {
        successHandler(thunkAPI.dispatch, "Task added")
        return { todoListId: arg.todoListId, newTask: newTask.data }
      }
    } catch (e) {
      networkErrorHandler(thunkAPI.dispatch, e)
      return thunkAPI.rejectWithValue(null)
    }
  },
)
const fetchDeleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (
    arg: {
      todoListId: string
      taskId: string
    },
    { dispatch, rejectWithValue },
  ) => {
    dispatch(AppActions.appSetStatusAC({ status: "loading" }))
    try {
      dispatch(
        TasksActions.changeTaskEntityStatusAC({
          todoListId: arg.todoListId,
          taskId: arg.taskId,
          status: "loading",
        }),
      )
      let deleteTask = await task_API.deleteTask(arg.todoListId, arg.taskId)
      if (deleteTask.data.resultCode) {
        localErrorHandler(dispatch, deleteTask)
        dispatch(AppActions.appSetStatusAC({ status: "failed" }))
        return rejectWithValue(null)
      } else {
        successHandler(dispatch, "Task was deleted")
        dispatch(AppActions.appSetStatusAC({ status: "succeeded" }))
        return { todoListId: arg.todoListId, taskId: arg.taskId }
      }
    } catch (error) {
      networkErrorHandler(dispatch, error)
      dispatch(AppActions.appSetStatusAC({ status: "failed" }))
      return rejectWithValue(null)
    }
  },
)
const fetchUpdateTaskField = createAsyncThunk(
  "tasks/updateField",
  async (arg: { todoListId: string; taskId: string; newField: T_PutTask }, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
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
      try {
        let newTask = await task_API.updateTask(arg.todoListId, arg.taskId, taskModel)
        if (newTask.data.resultCode) {
          localErrorHandler(thunkAPI.dispatch, newTask)
          return thunkAPI.rejectWithValue(null)
        } else {
          successHandler(thunkAPI.dispatch, "Task was updated")
          return {
            todolisId: arg.todoListId,
            taskId: arg.taskId,
            taskModel: arg.newField,
          }
        }
      } catch (e) {
        networkErrorHandler(thunkAPI.dispatch, e)
        return thunkAPI.rejectWithValue(null)
      }
    } else {
      return thunkAPI.rejectWithValue(null)
    }
  },
)
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
      const task = state[action.payload.todoListId].findIndex((el) => el.id === action.payload.taskId)
      state[action.payload.todoListId][task].entityTaskStatus = action.payload.status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodoList.fetchAddNewTodoList.fulfilled, (state, action) => {
        state[action.payload.newTL.data.item.id] = []
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
          state[action.payload.todoListId] = [action.payload.newTask.data.item, ...state[action.payload.todoListId]]
        } else {
          state[action.payload.todoListId] = [action.payload.newTask.data.item, ...state[action.payload.todoListId]]
        }
      })
      .addCase(fetchDeleteTask.fulfilled, (state, action) => {
        const index = state[action.payload.todoListId].findIndex((el) => el.id === action.payload.taskId)
        state[action.payload.todoListId].splice(index, 1)
      })
      .addCase(fetchUpdateTaskField.fulfilled, (state, action) => {
        const task = state[action.payload.todolisId].findIndex((el) => el.id === action.payload.taskId)
        state[action.payload.todolisId][task] = {
          ...state[action.payload.todolisId][task],
          ...action.payload.taskModel,
        }
      })
  },
})

export const TasksActions = taskSlice.actions
export const tasks_reducer = taskSlice.reducer
export const asyncTasks = { fetchTasks, fetchCreateTask, fetchDeleteTask, fetchUpdateTaskField }
