import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import {tasks_reducer} from "./reducers/tasks_reducer";
import {todoList_reducer} from "./reducers/todoList_reducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {app_reducer} from "./reducers/app_reducer";

const rootReducer = combineReducers({
    tasks_reducer: tasks_reducer,
    todoList_reducer: todoList_reducer,
    app_reducer: app_reducer
})

// type T_MainAppAction = T_MainTL | T_MainTasks
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>

//@ts-ignore
window.store = store