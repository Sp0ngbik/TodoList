import React from "react"
import { useAppSelector } from "../../hooks/redux_hooks/hooks"
import style from "./loadingScale.module.css"

const LoadingScale = () => {
  const appStatus = useAppSelector((state) => state.app.status)
  return appStatus === "loading" ? <div className={style.loadingScale}></div> : <span>{""}</span>
}

export default LoadingScale
