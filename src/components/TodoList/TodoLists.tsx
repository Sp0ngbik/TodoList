import React, {RefObject, useCallback, useEffect, useRef} from "react";
import style from './todoList.module.css'
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {deleteTodoListTK, editTodoListTitleTK} from "../../redux/reducers/todoList_reducer";
import {createTasksTK, getTasksTK} from "../../redux/reducers/tasks_reducer";
import {T_TaskResponseItems} from "../../api/task_API";
import Task from "../Task/Task";
import EditableSpan from "../EdditableSpan/EditableSpan";

type T_TodoListsProps = {
    title: string,
    todoListId: string
}

export const TodoLists: React.FC<T_TodoListsProps> = React.memo(({title, todoListId}) => {
    const dispatch = useAppDispatch()

    const loadTasks = useCallback(() => {
        dispatch(getTasksTK(todoListId))
    }, [todoListId, dispatch])

    useEffect(() => {
        loadTasks()
    }, [loadTasks]);

    const tasksData: T_TaskResponseItems[] = useAppSelector(state => state.tasks_reducer[todoListId])

    const newTitle: RefObject<HTMLInputElement> = useRef(null)

    const removeTodoListId = useCallback(() => {
        dispatch(deleteTodoListTK(todoListId))
    }, [todoListId, dispatch])

    const editTodoListTitle = useCallback((title: string) => {
        dispatch(editTodoListTitleTK(todoListId, title))
    }, [todoListId])

    const addTask = useCallback(() => {
        if (newTitle.current) {
            dispatch(createTasksTK(todoListId, newTitle.current.value))
            newTitle.current.value = ''
        }
    }, [todoListId, dispatch])


    return <div className={style.todoListWrapper}>
        <div className={style.todoList}>
            <EditableSpan prevTitle={title} callbackFunc={editTodoListTitle}/>
            <button onClick={removeTodoListId}>X</button>
        </div>
        <div>
            <div>
                <input ref={newTitle}/>
                <button onClick={addTask}>+</button>
            </div>
            {tasksData && tasksData.map((el) => (
                <Task key={el.id} id={el.id} title={el.title} todoListId={todoListId} status={el.status}
                />
            ))}
        </div>
    </div>
});

