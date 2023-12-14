import { asyncTodoList, T_TodoListInitial, todoList_reducer, todoListActions } from "../redux/reducers/todoList_reducer"
import { T_TodoListPost } from "../api/todolist_API"

let todoListId1: string
let todoListId2: string
let todoLists: T_TodoListInitial[]
beforeEach(() => {
  todoListId1 = "todoListId1"
  todoListId2 = "todoListId2"
  todoLists = [
    { id: todoListId1, filter: "all", entityStatus: "idle", addedDate: "", order: 2, title: "TodoList1" },
    { id: todoListId2, filter: "all", entityStatus: "idle", addedDate: "", order: 2, title: "TodoList2" },
  ]
})

test("todoList should received", () => {
  const endState = todoList_reducer(
    [],
    asyncTodoList.fetchTodoLists.fulfilled({ tlData: todoLists }, "addTodos", undefined),
  )

  expect(endState[0].id).toBe(todoListId1)
  expect(endState[1].id).toBe(todoListId2)
})

test("todolist should be deleted", () => {
  const endState = todoList_reducer(
    todoLists,
    asyncTodoList.fetchDeleteTodoList.fulfilled({ todoListId: todoListId1 }, "delete todo", todoListId1),
  )

  expect(endState[0].id).toBe(todoListId2)
  expect(endState[1]).toBe(undefined)
})

test("todolist must add to array", () => {
  const newTl: T_TodoListPost = {
    item: {
      id: "todoListNew",
      order: 3,
      addedDate: "",
      title: "newTl",
    },
  }
  const endState = todoList_reducer(
    todoLists,
    asyncTodoList.fetchAddNewTodoList.fulfilled({ newTL: newTl }, "add new todolist", "newTl"),
  )
  expect(endState[0].id).toBe(newTl.item.id)
  expect(endState[0].title).toBe(newTl.item.title)
  expect(endState[1].title).toBe(todoLists[0].title)
  expect(endState[2].id).toBe(todoLists[1].id)
})

test("todolist title should update", () => {
  const newTitle = "new title"
  const endState = todoList_reducer(
    todoLists,
    asyncTodoList.fetchUpdateTodoListTitle.fulfilled(
      { todoListId: todoListId1, newTitleTL: newTitle },
      "update title todolist",
      { title: newTitle, todoListId: todoListId1 },
    ),
  )

  expect(endState[0].title).toStrictEqual(newTitle)
})

test("change todolist entity status", () => {
  const endState = todoList_reducer(
    todoLists,
    todoListActions.changeTodoListEntityStatusAC({ todoListId: todoListId1, status: "loading" }),
  )
  expect(endState[0].entityStatus).toBe("loading")
  expect(endState[1].entityStatus).toBe("idle")
})

test("change todolist filter", () => {
  const endState = todoList_reducer(
    todoLists,
    todoListActions.changeTodoListFilterAC({ todoListId: todoListId1, filter: "completed" }),
  )
  expect(endState[0].filter).toBe("completed")
  expect(endState[1].filter).toBe("all")
})
