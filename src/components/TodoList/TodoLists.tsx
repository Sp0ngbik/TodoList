import React, {RefObject, useCallback, useRef} from "react";
import style from './todoList.module.css'
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {changeTodoListFilterAC, deleteTodoListTK, editTodoListTitleTK} from "../../redux/reducers/todoList_reducer";
import {createTasksTK} from "../../redux/reducers/tasks_reducer";
import {T_TaskResponseItems, TasksStatus} from "../../api/task_API";
import Task from "../Task/Task";
import EditableSpan from "../EdditableSpan/EditableSpan";
import {T_FilterValues} from "../../AppTodoList";

type T_TodoListsProps = {
    title: string,
    todoListId: string,
    filter: T_FilterValues
}

export const TodoLists: React.FC<T_TodoListsProps> = React.memo(({title, todoListId, filter}) => {
    const dispatch = useAppDispatch()
    const tasksData: T_TaskResponseItems[] = useAppSelector(state => state.tasks_reducer[todoListId])
    const newTitle: RefObject<HTMLInputElement> = useRef(null)
    const removeTodoListId = useCallback(() => {
        dispatch(deleteTodoListTK(todoListId))
    }, [todoListId, dispatch])
    const editTodoListTitle = useCallback((title: string) => {
        dispatch(editTodoListTitleTK(todoListId, title))
    }, [todoListId, dispatch])
    const addTask = useCallback(() => {
        if (newTitle.current) {
            dispatch(createTasksTK(todoListId, newTitle.current.value))
            newTitle.current.value = ''
        }
    }, [todoListId, dispatch])
    const changeFilter = useCallback((filterValue: T_FilterValues) => {
        dispatch(changeTodoListFilterAC(todoListId, filterValue))
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
            {tasksData && filterTasksData().map((el) => (
                <Task key={el.id} id={el.id}
                      title={el.title}
                      todoListId={todoListId}
                      status={el.status}
                />
            ))}
            <div>
                <button onClick={() => {
                    changeFilter('all')
                }}>All
                </button>
                <button onClick={() => {
                    changeFilter('completed')
                }}>Completed
                </button>
                <button onClick={() => {
                    changeFilter('inProgress')
                }}>InProgress
                </button>
            </div>
        </div>
    </div>
});

