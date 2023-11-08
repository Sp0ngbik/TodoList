import {applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {T_MainTasks, tasks_reducer} from "./reducers/tasks_reducer";
import {T_MainTL, todoList_reducer} from "./reducers/todoList_reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";

const rootReducer = combineReducers({
    tasks_reducer: tasks_reducer,
    todoList_reducer: todoList_reducer
})

type T_MainAppAction = T_MainTL | T_MainTasks
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, T_MainAppAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, T_MainAppAction>
