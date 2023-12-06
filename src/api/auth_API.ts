import {instanceAxios} from "./todolist_API";

export const auth_API = {
    authMe: () => {
        return instanceAxios.get('auth/me')
    }
}

