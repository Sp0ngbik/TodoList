export type T_AuthResponse<T = {}> = {
  data: T
  messages: string[]
  fieldsErrors: string[]
  resultCode: number
}
export type T_AuthMeData = {
  id: number
  login: string
  email: string
}

export type T_AuthorizeData = {
  email: string
  password: string
  rememberMe: boolean
}
