import React, {ChangeEvent, FC, useState} from 'react';
import style from './editableSpan.module.css'

type T_EditableSpan = {
    callbackFunc: (title: string) => void,
    prevTitle: string,
    disabled: boolean
}

const EditableSpan: FC<T_EditableSpan> = ({callbackFunc, prevTitle, disabled}) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(prevTitle)
    const [errorStatus, setErrorStatus] = useState(false)
    const onActivateEditMode = () => {
        disabled ? setEditMode(false) : setEditMode(true)
    }
    const onDeactivateEditMode = () => {
        if (title.trim()) {
            setEditMode(false)
            callbackFunc(title)
        } else {
            setErrorStatus(true)
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (errorStatus) {
            setErrorStatus(false)
            setTitle(e.currentTarget.value)
        } else {
            setTitle(e.currentTarget.value)
        }
    }
    return (
        editMode ?
            <div className={style.editSpanWrapper}>
                <input value={title} onChange={onChangeHandler} className={errorStatus ? style.error : ''}
                       autoFocus
                       onBlur={onDeactivateEditMode}/>
                {errorStatus && <div className={style.error_text}>Error in field</div>}
            </div>
            :
            <div onDoubleClick={onActivateEditMode}>{title}</div>
    );
};

export default EditableSpan;