import React, {useEffect} from 'react';
import style from './notification.module.css'
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {appSetStatusAC} from "../../redux/reducers/app_reducer";

const Notification = () => {
    const dispatch = useAppDispatch()
    const appNotificationSelector = useAppSelector(state => state.app_reducer)
    useEffect(() => {
        const b = setTimeout(() => {
            dispatch(appSetStatusAC('idle', null))
        }, 3000)
        return () => {
            clearTimeout(b)
        }
    }, [appNotificationSelector])
    const classValidator = () => {
        if (appNotificationSelector.status === 'failed') {
            return style.notification_failed
        } else if (
            appNotificationSelector.status === 'succeeded'
        ) {
            return style.notification_succeed
        } else {
            return ''
        }
    }
    // const classValidator =
    //     appNotificationSelector.status === 'failed' && style.notification_failed ||
    //     appNotificationSelector.status === 'succeeded' ? style.notification_succeed : ''
    return (
        <div className={style.notification_block}>
            <div className={classValidator()}>
                {appNotificationSelector.errorMessage && appNotificationSelector.errorMessage}
            </div>
        </div>
    );
};

export default Notification;