import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux_hooks/hooks";
import AddNewTodo from "../components/AddNewTodo/AddNewTodo";
import {TodoLists} from "../components/TodoList/TodoLists";
import style from './app.module.css'
import LoadingScale from "../helpers/loadingScale/LoadingScale";
import {Notification} from "../helpers/notification/Notification";
import {todoListSelector} from "../redux/selectorsHandler";
import {fetchTodoLists} from "../redux/reducers/todoList_reducer";

export type T_FilterValues = 'all' | 'completed' | 'inProgress'

const AppTodoList = React.memo(() => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTodoLists())
    }, [dispatch]);
    const todoListsData = useAppSelector(todoListSelector)
    return (
        <div>
            <LoadingScale/>
            <Notification/>
            <AddNewTodo/>
            <div className={style.allTodosWrapper}>
                {todoListsData.map(tl => (
                    <div key={tl.id}>
                        <TodoLists title={tl.title} todoListId={tl.id} filter={tl.filter}
                                   entityStatus={tl.entityStatus}/>
                    </div>
                ))}
            </div>
        </div>
    );
})

export default AppTodoList;
