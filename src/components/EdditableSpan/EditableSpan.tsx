import React, { FC, useState } from "react"
import style from "./editableSpan.module.css"
import { useFormik } from "formik"

type T_EditableSpan = {
  callbackFunc: (param: { title: string }) => void
  prevTitle: string
  disabled: boolean
}

const EditableSpan: FC<T_EditableSpan> = ({ callbackFunc, prevTitle, disabled }) => {
  // const [errorStatus, setErrorStatus] = useState(false)
  const [editMode, setEditMode] = useState(false)
  // const [title, setTitle] = useState(prevTitle)
  const onActivateEditMode = () => {
    disabled ? setEditMode(false) : setEditMode(true)
  }

  const editableFormik = useFormik({
    initialValues: {
      title: prevTitle,
    },
    validateOnBlur: true,
    validate: (values) => {
      if (values.title.trim().length <= 0) {
        return { title: "Required" }
      }
    },
    onSubmit: (values) => {
      setEditMode(false)
      callbackFunc({ title: values.title })
    },
  })

  return editMode ? (
    <>
      {editableFormik.touched.title && editableFormik.errors.title && <div>{editableFormik.errors.title}</div>}
      <div className={style.editSpanWrapper}>
        <form onSubmit={editableFormik.handleSubmit}>
          <input {...editableFormik.getFieldProps("title")} autoFocus onBlur={editableFormik.submitForm} />
        </form>
      </div>
    </>
  ) : (
    <div onDoubleClick={onActivateEditMode}>{prevTitle}</div>
  )
}

export default EditableSpan
