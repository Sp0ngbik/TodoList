import React from "react"
import { useAppDispatch } from "../../hooks/redux_hooks/hooks"
import { fetchAddNewTodoList } from "../../redux/reducers/todoList_reducer"
import style from "./addNewTodo.module.css"
import { useFormik } from "formik"

const AddNewTodo = () => {
  const dispatch = useAppDispatch()

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
      dispatch(fetchAddNewTodoList(values.newTitleForTodoList))
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
