import React, {FC, useCallback} from 'react';
import {deleteTaskTK, updateTaskFields, updateTaskTitleTK} from "../../redux/reducers/tasks_reducer";
import {useAppDispatch} from "../../hooks/hooks";
import style from './tasks.module.css'
import {TasksStatus} from "../../api/task_API";
import EditableSpan from "../EdditableSpan/EditableSpan";
import {T_ResponseStatus} from "../../redux/reducers/app_reducer";

type T_Task = {
    id: string
    title: string,
    todoListId: string,
    status: TasksStatus
    entityStatus: T_ResponseStatus
}

const Task: FC<T_Task> = ({title, id, todoListId, status, entityStatus}) => {
    const dispatch = useAppDispatch()

    const deleteTask = useCallback((taskId: string) => {
        dispatch(deleteTaskTK(todoListId, taskId))
    }, [todoListId, dispatch])

    const changeStatus = useCallback((status: TasksStatus) => {
        dispatch(updateTaskFields(todoListId, id, status, title))
    }, [todoListId, id, dispatch, title])

    const updateTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTitleTK(todoListId, id, title))
    }, [todoListId, id, dispatch])

    const isTaskDisabled = entityStatus === 'loading'
    return (
        <div key={crypto.randomUUID()}>
            <div className={style.task_wrapper}>
                <input
                    disabled={isTaskDisabled}
                    checked={status === TasksStatus.Completed}
                    onChange={(e) =>
                        changeStatus(e.currentTarget.checked ? TasksStatus.Completed : TasksStatus.InProgress)}
                    type='checkbox'/>
                <EditableSpan disabled={isTaskDisabled} callbackFunc={updateTaskTitle} prevTitle={title}/>
                <button onClick={() => deleteTask(id)} disabled={isTaskDisabled}>X</button>
            </div>
        </div>
    );
};

export default Task;