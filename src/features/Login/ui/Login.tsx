import React from "react"
import style from "./form.module.css"
import { useAppSelector } from "common/hooks/redux_hooks/useAction"
import { Navigate } from "react-router-dom"
import { isLoggedInSelector } from "../model/authSelectors"
import { useLogin } from "features/Login/lib/useLogin"

const Login = () => {
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const loginFormik = useLogin()

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <div className={style.formBlock}>
      <form className={style.formItems} onSubmit={loginFormik.handleSubmit}>
        <label>
          <p>
            To log in get registered{" "}
            <a href={"https://social-network.samuraijs.com/"} target={"opener"}>
              here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p> Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </label>
        {loginFormik.touched.email && loginFormik.errors.email && (
          <div className={style.errorMessage}>{loginFormik.errors.email}</div>
        )}
        <input placeholder={"Email"} {...loginFormik.getFieldProps("email")} />
        {loginFormik.touched.password && loginFormik.errors.password && (
          <div className={style.errorMessage}>{loginFormik.errors.password}</div>
        )}
        <input
          placeholder={"Password"}
          type={"password"}
          {...loginFormik.getFieldProps("password")}
        />
        <div>
          <input onChange={loginFormik.handleChange} type="checkbox" name="rememberMe" />
          <span> Remember me</span>
        </div>
        <button type={"submit"}>Send</button>
      </form>
    </div>
  )
}

export default Login
