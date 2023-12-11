import React from "react"
import { useFormik } from "formik"
import style from "./form.module.css"
import { useActions, useAppSelector } from "../../hooks/redux_hooks/hooks"
import { asyncAuthActions } from "../../redux/reducers"
import { Navigate } from "react-router-dom"
import { isLoggedInSelector } from "../../redux/selectorsHandler"

type T_FormikTypes = {
  email: string
  password: string
  rememberMe: boolean
}

const Login = () => {
  const isLoggedIn = useAppSelector(isLoggedInSelector)
  const { fetchLogin } = useActions(asyncAuthActions)

  const formikHandler = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    } as T_FormikTypes,
    validate: (values) => {
      if (!values.email) {
        return { email: "Required" }
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        return { email: "Invalid email address" }
      }
      if (!values.password) {
        return { password: "Password required" }
      }
    },
    onSubmit: (values) => {
      fetchLogin({ data: values })
    },
  })

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <div className={style.formBlock}>
      <form className={style.formItems} onSubmit={formikHandler.handleSubmit}>
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
        {formikHandler.touched.email && formikHandler.errors.email && (
          <div className={style.errorMessage}>{formikHandler.errors.email}</div>
        )}
        <input placeholder={"Email"} {...formikHandler.getFieldProps("email")} />
        {formikHandler.touched.password && formikHandler.errors.password && (
          <div className={style.errorMessage}>{formikHandler.errors.password}</div>
        )}
        <input placeholder={"Password"} type={"password"} {...formikHandler.getFieldProps("password")} />
        <div>
          <input onChange={formikHandler.handleChange} type="checkbox" name="rememberMe" />
          <span> Remember me</span>
        </div>
        <button type={"submit"}>Send</button>
      </form>
    </div>
  )
}

export default Login
