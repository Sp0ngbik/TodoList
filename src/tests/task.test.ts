import { asyncTasks, T_TasksReducer, tasks_reducer, tasksActions } from "../redux/reducers/tasks_reducer"
import { T_CreateTask, TasksStatus } from "../api/task_API"

let taskId1: string
let taskId2: string
let tasks: T_TasksReducer
const todoListId1 = "todoListId1"

beforeEach(() => {
  taskId1 = "taskId1"
  taskId2 = "taskId2"
  tasks = {
    [todoListId1]: [
      {
        id: taskId1,
        status: TasksStatus.New,
        todoListId: todoListId1,
        title: "task1",
        addedDate: "",
        order: 2,
        deadLine: "",
        description: "task1",
        startDate: "",
        entityTaskStatus: "idle",
        priority: 2,
      },
      {
        id: taskId2,
        status: TasksStatus.New,
        todoListId: todoListId1,
        title: "task2",
        addedDate: "",
        order: 3,
        deadLine: "",
        description: "task2",
        startDate: "",
        entityTaskStatus: "idle",
        priority: 3,
      },
    ],
  }
})

test("should set tasks", () => {
  const endState = tasks_reducer(
    {},
    asyncTasks.fetchTasks.fulfilled(
      { tasks: tasks[todoListId1], todoListId: todoListId1 },
      "tasks should set",
      todoListId1,
    ),
  )
  expect(endState[todoListId1].length).toBe(2)
})

test("should add task to todolist", () => {
  const title = "task3"
  const newTask: T_CreateTask = {
    data: {
      resultCode: 0,
      messages: [],
      item: {
        id: "task3",
        addedDate: "",
        order: 4,
        deadLine: "",
        description: "new task",
        entityTaskStatus: "idle",
        priority: 3,
        title: title,
        status: TasksStatus.New,
        todoListId: todoListId1,
        startDate: "",
      },
    },
  }

  const endState = tasks_reducer(
    tasks,
    asyncTasks.fetchCreateTask.fulfilled(
      { todoListId: todoListId1, newTask: newTask },
      "task should be added to todolist",
      { title: title, todoListId: todoListId1 },
    ),
  )
  expect(endState[todoListId1].length).toBe(3)
  expect(endState[todoListId1][0].title).toBe(title)
})

test("task should delete from todolist", () => {
  const endState = tasks_reducer(
    tasks,
    asyncTasks.fetchDeleteTask.fulfilled({ todoListId: todoListId1, taskId: taskId1 }, "task should remove", {
      todoListId: todoListId1,
      taskId: taskId1,
    }),
  )
  expect(endState[todoListId1].length).toBe(1)
  expect(endState[todoListId1][0].id).toBe(taskId2)
})

test("task should update", () => {
  const title = "new title"
  const updatedTask = { ...tasks[todoListId1][0], title: title, completed: false, deadline: "" }
  const endState = tasks_reducer(
    tasks,
    asyncTasks.fetchUpdateTaskField.fulfilled(
      { todoListId: todoListId1, taskId: taskId1, taskModel: updatedTask },
      "task update",
      { taskId: taskId1, todoListId: todoListId1, newField: { title: title } },
    ),
  )
  expect(endState[todoListId1].length).toBe(2)
  expect(endState[todoListId1][0].title).toBe(title)
})

test("tasks entity status should change", () => {
  const endState = tasks_reducer(
    tasks,
    tasksActions.changeTaskEntityStatusAC({
      taskId: taskId1,
      todoListId: todoListId1,
      status: "loading",
    }),
  )
  expect(endState[todoListId1][0].entityTaskStatus).toBe("loading")
})
