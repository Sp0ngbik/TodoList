import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import {appSetStatusAC} from "../../redux/reducers/app_reducer";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

export const Notification = () => {
    const dispatch = useAppDispatch()
    const appStatus = useAppSelector((state) => state.app_reducer)

    useEffect(() => {
        console.log(appStatus.informMessage)
        if (appStatus.informMessage && appStatus.status === 'failed') {
            toast.error(appStatus.informMessage)
        } else if (appStatus.informMessage && appStatus.status === 'succeeded') {
            toast.success(appStatus.informMessage)
        }
        toast.onChange(({status}) => {
            if (status === 'added') {
                dispatch(appSetStatusAC('idle', null))
            }
        })
    }, [appStatus.informMessage])

    return <ToastContainer theme="dark" autoClose={3000}/>
}
