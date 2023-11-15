import React, {ChangeEvent, FC, useState} from 'react';
import style from './editableSpan.module.css'

type T_EditableSpan = {
    callbackFunc: (title: string) => void,
    prevTitle: string
}

const EditableSpan: FC<T_EditableSpan> = ({callbackFunc, prevTitle}) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(prevTitle)
    const [errorStatus, setErrorStatus] = useState(false)
    const onActivateEditMode = () => {
        setEditMode(true)
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
        if (!errorStatus) {
            setTitle(e.currentTarget.value)
        } else {
            setTitle(e.currentTarget.value)
            setErrorStatus(false)
        }
    }
    return (
        editMode ?
            <div>
                <input value={title} onChange={onChangeHandler} className={errorStatus ? style.error : ''} autoFocus
                       onBlur={onDeactivateEditMode}/>
                {errorStatus && <span>Error in field</span>}
            </div>
            :
            <div onDoubleClick={onActivateEditMode}>{title}</div>
    );
};

export default EditableSpan;