import { RootState } from "app/store"

export const isLoggedInSelector = (state: RootState) => state.auth.isLoggedIn
