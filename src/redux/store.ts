import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {tasks_reducer} from "./reducers/tasks_reducer";
import {todoList_reducer} from "./reducers/todoList_reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {app_reducer} from "./reducers/app_reducer";
import {configureStore} from "@reduxjs/toolkit";

// const rootReducer = combineReducers({
//     tasks_reducer: tasks_reducer,
//     todoList_reducer: todoList_reducer,
//     app_reducer: app_reducer
// })
const mainReducer ={
    tasks_reducer: tasks_reducer,
    todoList_reducer: todoList_reducer,
    app_reducer: app_reducer
}

export const store = configureStore({
    reducer:{
        tasks: tasks_reducer,
        todoList: todoList_reducer,
        app: app_reducer
    }
})
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
// type T_MainAppAction = T_MainTL | T_MainTasks
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
// export type RootState = ReturnType<typeof store>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

//@ts-ignore
window.store = store