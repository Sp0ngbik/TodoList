import React, {ChangeEvent, FC, useState} from 'react';
import style from './editableSpan.module.css'

type T_EditableSpan = {
    callbackFunc: (title: string) => void,
    prevTitle: string,
    disabled: boolean
}

const EditableSpan: FC<T_EditableSpan> = ({callbackFunc, prevTitle, disabled}) => {
    const [errorStatus, setErrorStatus] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState(prevTitle)
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
        setTitle(e.currentTarget.value)
        setErrorStatus(false)
    }
    return (
        editMode ?
            <div className={style.editSpanWrapper}>
                <input
                    value={title}
                    onChange={onChangeHandler}
                    className={errorStatus ? style.error : ''}
                    autoFocus
                    onBlur={onDeactivateEditMode}
                />
                {errorStatus && <div className={style.error_text}>Error in field</div>}
            </div>
            :
            <div onDoubleClick={onActivateEditMode}>{prevTitle}</div>
    );
};

export default EditableSpan;


// const updateDeckHandler = (deckId: string) => {
//     newEditValue &&
//     dispatch(updateDeckTC(deckId, newEditValue))
//     setEditMode(false)
// }
// const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     setNewEditValue(e.currentTarget.value)
// }
// const deleteDeckHandler = (deckId: string) => {
//     dispatch(deleteDeckTC(deckId))
// }
// return (
//     <li className={s.item}>
//         <h3 className={s.title}>
//
//             {editMode ? <input
//                 value={newEditValue}
//                 onChange={onChangeHandler}
//                 onBlur={() => {
//                     updateDeckHandler(deck.id)
//                 }}
//             />