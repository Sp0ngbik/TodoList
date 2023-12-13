import React, { FC } from "react"
import style from "./addNewTodo.module.css"
import { FormikHelpers, useFormik } from "formik"
import { useAppDispatch } from "../../hooks/redux_hooks/hooks"
import { fetchAddNewTodoList } from "../../redux/reducers/todoList_reducer"
import { fetchCreateTask } from "../../redux/reducers/tasks_reducer"

type T_AddNewItem = {
  callback: Function
}

const AddNewItem: FC<T_AddNewItem> = ({ callback }) => {
  const dispatch = useAppDispatch()
  const addItemFormik = useFormik({
    initialValues: {
      newItemTitle: "",
    },
    validate: (values) => {
      if (values.newItemTitle.trim().length <= 0) {
        return { newItemTitle: "Required" }
      }
    },
    onSubmit: async (values, formikHelpers: FormikHelpers<{ newItemTitle: string }>) => {
      const action = await dispatch(callback({ title: values.newItemTitle }))
      // callback({ title: values.newItemTitle })
      if (fetchAddNewTodoList.rejected.match(action)) {
        console.log(action.payload?.errors)
        formikHelpers.setFieldError("newItemTitle", action.payload?.errors)
      } else if (fetchCreateTask.rejected.match(action)) {
        formikHelpers.setFieldError("newItemTitle", action.payload?.errors)
      } else {
        addItemFormik.resetForm()
      }
    },
  })
  console.log(addItemFormik.errors)
  return (
    <div className={style.newTodoWrapper}>
      <form className={style.newTodoBlock} onSubmit={addItemFormik.handleSubmit}>
        <input type="text" {...addItemFormik.getFieldProps("newItemTitle")} />
        <button type={"submit"}>+</button>
      </form>
      {addItemFormik.touched.newItemTitle && addItemFormik.errors.newItemTitle && (
        <div>{addItemFormik.errors.newItemTitle}</div>
      )}
    </div>
  )
}

export default AddNewItem
