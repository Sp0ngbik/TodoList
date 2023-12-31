export type T_TodoListCreate = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type T_TodoListPost = {
  item: T_TodoListCreate
}

export type T_TodoListResponse<D = {}> = {
  resultCode: number
  messages: string[]
  data: D
}
