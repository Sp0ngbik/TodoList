import { instanceAxios } from "./todolist_API"

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

export const auth_API = {
  authMe: () => {
    return instanceAxios.get<T_AuthResponse<T_AuthMeData>>("auth/me")
  },
  loginMe: (data: T_AuthorizeData) => {
    console.log(data)
    return instanceAxios.post<T_AuthResponse<{ userId: number }>>("/auth/login", data)
  },
  logOutMe: () => {
    return instanceAxios.delete<T_AuthResponse>("/auth/login")
  },
}
