import React, {FC, useCallback} from 'react';
import {deleteTaskTK, updateTaskFields, updateTaskTitleTK} from "../../redux/reducers/tasks_reducer";
import {useAppDispatch} from "../../hooks/hooks";
import style from './tasks.module.css'
import {TasksStatus} from "../../api/task_API";
import EditableSpan from "../EdditableSpan/EditableSpan";

type T_Task = {
    id: string
    title: string,
    todoListId: string,
    status: TasksStatus
}

const Task: FC<T_Task> = ({title, id, todoListId, status}) => {
    const dispatch = useAppDispatch()

    const deleteTask = useCallback((taskId: string) => {
        dispatch(deleteTaskTK(todoListId, taskId))
    }, [todoListId, dispatch])

    const changeStatus = useCallback((status: TasksStatus) => {
        dispatch(updateTaskFields(todoListId, id, status, title))
    }, [todoListId, id])

    const updateTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTitleTK(todoListId, id, title))
    }, [todoListId, id])

    return (
        <div key={crypto.randomUUID()}>
            <div className={style.task_wrapper}>
                <input
                    checked={status === TasksStatus.Completed}
                    onChange={(e) =>
                        changeStatus(e.currentTarget.checked ? TasksStatus.Completed : TasksStatus.InProgress)}
                    type='checkbox'/>
                <EditableSpan callbackFunc={updateTaskTitle} prevTitle={title}/>
                <button onClick={() => deleteTask(id)}>X</button>
            </div>
        </div>
    );
};

export default Task;