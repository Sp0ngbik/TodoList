import React, { FC, useState } from "react"
import style from "common/components/EdditableSpan/editableSpan.module.css"
import { useFormik } from "formik"

type Props = {
  callbackFunc: (param: { title: string }) => void
  prevTitle: string
  disabled: boolean
}

export const EditableSpan: FC<Props> = ({ callbackFunc, prevTitle, disabled }) => {
  const [editMode, setEditMode] = useState(false)
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

  return (
    <div className={style.editSpanWrapper}>
      {editMode ? (
        <div>
          {editableFormik.touched.title && editableFormik.errors.title && (
            <div>{editableFormik.errors.title}</div>
          )}
          <div>
            <form onSubmit={editableFormik.handleSubmit}>
              <textarea
                {...editableFormik.getFieldProps("title")}
                autoFocus
                onBlur={editableFormik.submitForm}
              />
            </form>
          </div>
        </div>
      ) : (
        <div onDoubleClick={onActivateEditMode}>{prevTitle}</div>
      )}
    </div>
  )
}
