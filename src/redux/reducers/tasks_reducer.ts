import { RootState } from "../store"
import { T_CreateTask, T_TaskResponseItems, T_UpdateTask, task_API } from "../../api/task_API"
import { appActions, T_ResponseStatus } from "./app_reducer"
import { localErrorHandler, networkErrorHandler } from "../../utils/errorsHandler"
import { successHandler } from "../../utils/successHandler"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { asyncTodoList } from "./todoList_reducer"
import { createAppAsyncThunk } from "../../utils/createAppAsyncThunk"
import { ResultCode, TasksStatus } from "../../enums/enums"

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

const fetchTasks = createAppAsyncThunk<{ tasks: T_TaskResponseItems[]; todoListId: string }, string>(
  "tasks/getTasks",
  async (todoListId, { dispatch, rejectWithValue }) => {
    try {
      const tasksData = await task_API.getTask(todoListId)
      const tasks = tasksData.data.items
      return { tasks, todoListId }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  },
)

export const fetchCreateTask = createAppAsyncThunk<
  { todoListId: string; newTask: T_CreateTask },
  { todoListId: string; title: string }
>("tasks/createTask", async ({ todoListId, title }, { dispatch, rejectWithValue }) => {
  dispatch(appActions.appSetStatusAC({ status: "loading" }))
  try {
    const newTask = await task_API.createTask(todoListId, title)
    if (newTask.data.resultCode === ResultCode.success) {
      successHandler(dispatch, "Task added")
      return { todoListId, newTask: newTask.data }
    } else {
      return localErrorHandler(dispatch, newTask, rejectWithValue, false)
    }
  } catch (e) {
    return networkErrorHandler(dispatch, e, rejectWithValue)
  }
})
const fetchDeleteTask = createAppAsyncThunk<
  { todoListId: string; taskId: string },
  { todoListId: string; taskId: string }
>("tasks/deleteTask", async ({ todoListId, taskId }, { dispatch, rejectWithValue }) => {
  dispatch(appActions.appSetStatusAC({ status: "loading" }))
  try {
    dispatch(
      tasksActions.changeTaskEntityStatusAC({
        todoListId: todoListId,
        taskId: taskId,
        status: "loading",
      }),
    )
    let deleteTask = await task_API.deleteTask(todoListId, taskId)
    if (deleteTask.data.resultCode === ResultCode.success) {
      successHandler(dispatch, "Task was deleted")
      dispatch(appActions.appSetStatusAC({ status: "succeeded" }))
      return { todoListId, taskId }
    } else {
      dispatch(appActions.appSetStatusAC({ status: "failed" }))
      return localErrorHandler(dispatch, deleteTask, rejectWithValue)
    }
  } catch (error) {
    return networkErrorHandler(dispatch, error, rejectWithValue)
  }
})
const fetchUpdateTaskField = createAppAsyncThunk<
  { todoListId: string; taskId: string; taskModel: T_UpdateTask },
  { todoListId: string; taskId: string; newField: T_PutTask }
>("tasks/updateField", async ({ todoListId, taskId, newField }, { dispatch, getState, rejectWithValue }) => {
  const state = getState() as RootState
  const model: T_TaskResponseItems[] = state.tasks[todoListId]
  let task = model.find((el) => el.id === taskId)
  if (task) {
    const taskModel: T_UpdateTask = {
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadLine,
      priority: task.priority,
      startDate: task.startDate,
      completed: false,
      ...newField,
    }
    try {
      let newTask = await task_API.updateTask(todoListId, taskId, taskModel)
      if (newTask.data.resultCode) {
        return localErrorHandler(dispatch, newTask, rejectWithValue)
      } else {
        successHandler(dispatch, "Task was updated")
        return {
          todoListId,
          taskId,
          taskModel: newField,
        }
      }
    } catch (e) {
      return networkErrorHandler(dispatch, e, rejectWithValue)
    }
  }
})
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
        const task = state[action.payload.todoListId].findIndex((el) => el.id === action.payload.taskId)
        state[action.payload.todoListId][task] = {
          ...state[action.payload.todoListId][task],
          ...action.payload.taskModel,
        }
      })
  },
})

export const tasksActions = taskSlice.actions
export const tasks_reducer = taskSlice.reducer
export const asyncTasks = { fetchTasks, fetchCreateTask, fetchDeleteTask, fetchUpdateTaskField }
