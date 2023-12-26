import { useFormik } from "formik"
import { useActions } from "common/hooks/redux_hooks/useAction"
import { asyncAuthActions } from "features/Login/model/authSlice"

type T_FormikTypes = {
  email: string
  password: string
  rememberMe: boolean
}
export const useLogin = () => {
  const { fetchLogin } = useActions(asyncAuthActions)
  return useFormik({
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
      fetchLogin(values)
    },
  })
}
