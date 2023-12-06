import {useCallback} from "react";
import {fetchDeleteTask, fetchUpdateTaskField} from "../../redux/reducers/tasks_reducer";
import {TasksStatus} from "../../api/task_API";
import {AppDispatch} from "../../redux/store";

export const useTaskWorker = (dispatch: AppDispatch, todoListId: string, taskId: string) => {
    const deleteTask = useCallback(() => {
        dispatch(fetchDeleteTask({todoListId, taskId}))
    }, [taskId, todoListId, dispatch])

    const changeStatus = useCallback((status: TasksStatus) => {
        dispatch(fetchUpdateTaskField({todoListId, taskId, newField: {status}}))
    }, [taskId, todoListId, dispatch])

    const updateTaskTitle = useCallback((title: string) => {
        dispatch(fetchUpdateTaskField({todoListId, taskId, newField: {title}}))
    }, [taskId, todoListId, dispatch])

    return {deleteTask, changeStatus, updateTaskTitle}
}