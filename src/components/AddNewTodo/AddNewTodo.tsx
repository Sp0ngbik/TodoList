import React from "react"
import { useActions } from "../../hooks/redux_hooks/hooks"
import style from "./addNewTodo.module.css"
import { useFormik } from "formik"
import { asyncTodoList } from "../../redux/reducers"

const AddNewTodo = () => {
  const { fetchAddNewTodoList } = useActions(asyncTodoList)
  const todoListFormik = useFormik({
    initialValues: {
      newTitleForTodoList: "",
    },
    validate: (values) => {
      if (values.newTitleForTodoList.trim().length <= 0) {
        return { newTitleForTodoList: "Required" }
      }
    },
    onSubmit: (values) => {
      fetchAddNewTodoList(values.newTitleForTodoList)
      todoListFormik.resetForm()
    },
  })
  return (
    <div className={style.newTodoWrapper}>
      <form className={style.newTodoBlock} onSubmit={todoListFormik.handleSubmit}>
        <input type="text" {...todoListFormik.getFieldProps("newTitleForTodoList")} />
        <button type={"submit"}>+</button>
      </form>
      {todoListFormik.touched.newTitleForTodoList && todoListFormik.errors.newTitleForTodoList && (
        <div>{todoListFormik.errors.newTitleForTodoList}</div>
      )}
    </div>
  )
}

export default AddNewTodo
