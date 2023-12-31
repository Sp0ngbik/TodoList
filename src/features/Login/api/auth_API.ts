import { axiosInstance } from "common/utils/axiosInstance"
import { T_AuthMeData, T_AuthorizeData, T_AuthResponse } from "./authApi.types"

export const auth_API = {
  authMe: () => {
    return axiosInstance.get<T_AuthResponse<T_AuthMeData>>("auth/me")
  },
  loginMe: (data: T_AuthorizeData) => {
    return axiosInstance.post<T_AuthResponse<{ userId: number }>>("/auth/login", data)
  },
  logOutMe: () => {
    return axiosInstance.delete<T_AuthResponse>("/auth/login")
  },
}
