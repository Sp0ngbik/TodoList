import { T_AuthorizeData } from "../api/auth_API"
import { asyncAuthActions, authReducer } from "common/components/Login/model/authSlice"

let authState: { isLoggedIn: boolean }
let userData: T_AuthorizeData
beforeEach(() => {
  authState = {
    isLoggedIn: false,
  }
  userData = { email: "sp0ngbik@gmail.com", password: "not for you", rememberMe: true }
})

test("user should be logged in", () => {
  const endState = authReducer(authState, asyncAuthActions.fetchLogin.fulfilled(null, "login", userData))
  expect(endState.isLoggedIn).toBe(true)
})

test("user should be logged off", () => {
  const endState = authReducer(authState, asyncAuthActions.fetchLogout.fulfilled(undefined, "login", undefined))
  expect(endState.isLoggedIn).toBe(false)
})
