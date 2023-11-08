import React, {RefObject, useRef} from 'react';
import {useAppDispatch} from "../../hooks/hooks";
import {addNewTodoListTK} from "../../redux/reducers/todoList_reducer";

const AddNewTodo = () => {
    const newTitleForTodoList: RefObject<HTMLInputElement> = useRef(null)
    const dispatch = useAppDispatch()
    const addNewTodoList = () => {
        if (newTitleForTodoList.current) {
            dispatch(addNewTodoListTK(newTitleForTodoList.current.value))
            newTitleForTodoList.current.value = ''
        }
    }

    return (
        <div>
            <input ref={newTitleForTodoList}/>
            <button onClick={addNewTodoList}>+</button>
        </div>
    );
};

export default AddNewTodo;