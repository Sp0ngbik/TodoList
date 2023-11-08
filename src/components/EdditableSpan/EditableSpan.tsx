import React, {ChangeEvent, FC, useState} from 'react';

type T_EditableSpan = {
    callbackFunc: (title: string) => void,
    prevTitle: string
}

const EditableSpan: FC<T_EditableSpan> = ({callbackFunc, prevTitle}) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(prevTitle)

    const onActivateEditMode = () => {
        setEditMode(true)
    }
    const onDeactivateEditMode = () => {
        setEditMode(false)
        callbackFunc(title)
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    return (
        editMode ?
            <input value={title} onChange={onChangeHandler} autoFocus onBlur={onDeactivateEditMode}/> :
            <div onDoubleClick={onActivateEditMode}>{title}</div>
    );
};

export default EditableSpan;