import axios from "axios"

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "0c1210d9-02a1-4a51-8e24-3745e4974a4e",
  },
}

export const axiosInstance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
})
