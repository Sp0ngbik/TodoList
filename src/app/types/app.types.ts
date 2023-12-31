export type T_ResponseStatus = "idle" | "loading" | "succeeded" | "failed"

export type T_AppReducer = {
  status: T_ResponseStatus
  informMessage: string | null
  appInitialize: boolean
}

export type T_RejectAction = {
  type: string
  payload?: {
    messages: string[]
  }
  error?: {
    message: string
  }
}
