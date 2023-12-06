import React, {RefObject, useCallback, useRef, useState} from "react";
import style from './todoList.module.css'
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {changeTodoListFilterAC, fetchDeleteTodoList, fetchTodoListTitle} from "../../redux/reducers/todoList_reducer";
import {fetchCreateTask} from "../../redux/reducers/tasks_reducer";
import {T_TaskResponseItems, TasksStatus} from "../../api/task_API";
import Task from "../Task/Task";
import EditableSpan from "../EdditableSpan/EditableSpan";
import {T_FilterValues} from "../../app/AppTodoList";
import {T_ResponseStatus} from "../../redux/reducers/app_reducer";

type T_TodoListsProps = {
    title: string,
    todoListId: string,
    filter: T_FilterValues,
    entityStatus: T_ResponseStatus
}

export const TodoLists: React.FC<T_TodoListsProps> = React.memo((
    {title, todoListId, filter, entityStatus}) => {

    const dispatch = useAppDispatch()

    const tasksData: T_TaskResponseItems[] = useAppSelector(state => state.tasks[todoListId])

    const newTitle: RefObject<HTMLInputElement> = useRef(null)

    const [error, setError] = useState(false)

    const removeTodoListId = useCallback(() => {
        dispatch(fetchDeleteTodoList(todoListId))
    }, [todoListId, dispatch])

    const editTodoListTitle = useCallback((title: string) => {
        dispatch(fetchTodoListTitle({todoListId, title}))
    }, [todoListId, dispatch])

    const addTask = useCallback(() => {
        if (newTitle.current) {
            setError(false)
            if (
                newTitle.current.value.trim()
            ) {
                dispatch(fetchCreateTask({todoListId, title: newTitle.current.value}))
                newTitle.current.value = ''
            } else {
                setError(true)
            }
        }
    }, [todoListId, dispatch])

    const changeFilter = useCallback((filterValue: T_FilterValues) => {
        dispatch(changeTodoListFilterAC({todoListId, filter: filterValue}))
    }, [todoListId, dispatch])

    const filterTasksData = () => {
        if (filter === 'completed') {
            return tasksData.filter(task => task.status === TasksStatus.Completed)
        } else if (filter === 'inProgress') {
            return tasksData.filter(task => task.status === TasksStatus.InProgress || task.status === TasksStatus.New)
        } else {
            return tasksData
        }
    }

    const isEntityTodoListLoading = entityStatus === 'loading'

    return <div className={style.todoListWrapper}>
        <div className={style.todoList}>
            <EditableSpan disabled={isEntityTodoListLoading} prevTitle={title} callbackFunc={editTodoListTitle}/>
            <button onClick={removeTodoListId} disabled={isEntityTodoListLoading}>X</button>
        </div>
        <div>
            <div className={style.addTaskStyle}>
                <input ref={newTitle} className={error ? style.error : ''}/>
                <button onClick={addTask} disabled={isEntityTodoListLoading}>+</button>
                {error && <div>Wrong value</div>}
            </div>
            {tasksData && filterTasksData().map((el) => (
                <Task key={el.id}
                      id={el.id}
                      title={el.title}
                      todoListId={todoListId}
                      status={el.status}
                      entityStatus={el.entityTaskStatus}
                />
            ))}
            <div className={style.buttonsFilterStyle}>
                <button
                    className={filter === 'all' ? style.activeButton : ''}
                    onClick={() => {
                        changeFilter('all')
                    }}>All
                </button>
                <button
                    className={filter === 'completed' ? style.activeButton : ''}
                    onClick={() => {
                        changeFilter('completed')
                    }}>Completed
                </button>
                <button
                    className={filter === 'inProgress' ? style.activeButton : ''}
                    onClick={() => {
                        changeFilter('inProgress')
                    }}>InProgress
                </button>
            </div>
        </div>
    </div>
});

