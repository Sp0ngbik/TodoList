import React, { FC } from "react"
import style from "./addNewTodo.module.css"
import { useFormik } from "formik"

type T_AddNewItem = {
  callback: (arg: { title: string }) => {}
}

const AddNewItem: FC<T_AddNewItem> = ({ callback }) => {
  const addItemFormik = useFormik({
    initialValues: {
      newItemTitle: "",
    },
    validate: (values) => {
      if (values.newItemTitle.trim().length <= 0) {
        return { newItemTitle: "Required" }
      }
    },
    onSubmit: async (values) => {
      callback({ title: values.newItemTitle })
      addItemFormik.resetForm()
    },
  })
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
