import React, {FC} from 'react';
import {useAppDispatch} from "../../hooks/redux_hooks/hooks";
import style from './tasks.module.css'
import {TasksStatus} from "../../api/task_API";
import EditableSpan from "../EdditableSpan/EditableSpan";
import {T_ResponseStatus} from "../../redux/reducers/app_reducer";
import {useTaskWorker} from "../../hooks/workers_hooks/useTaskWorker";

type T_Task = {
    id: string
    title: string,
    todoListId: string,
    status: TasksStatus
    entityStatus: T_ResponseStatus
}

const Task: FC<T_Task> = ({title, id, todoListId, status, entityStatus}) => {
    const dispatch = useAppDispatch()
    const {deleteTask, updateTaskTitle, changeStatus} = useTaskWorker(dispatch,todoListId,id)

    const isTaskDisabled = entityStatus === 'loading'
    return (
        <div key={crypto.randomUUID()}>
            <div className={style.task_wrapper}>
                <input
                    disabled={isTaskDisabled}
                    checked={status === TasksStatus.Completed}
                    onChange={(e) =>
                        changeStatus( e.currentTarget.checked ? TasksStatus.Completed : TasksStatus.InProgress)}
                    type='checkbox'/>
                <EditableSpan disabled={isTaskDisabled}
                              callbackFunc={updateTaskTitle}
                              prevTitle={title}/>
                <button onClick={deleteTask} disabled={isTaskDisabled}>X</button>
            </div>
        </div>
    );
};

export default Task;