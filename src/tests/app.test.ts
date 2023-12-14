import { app_reducer, asyncApp } from "../redux/reducers"
import { appActions, T_AppReducer } from "../redux/reducers/app_reducer"

let appInitial: T_AppReducer

beforeEach(() => {
  appInitial = {
    status: "idle",
    appInitialize: false,
    informMessage: null,
  }
})

test("should init app", () => {
  const endState = app_reducer(appInitial, asyncApp.fetchInitApp.fulfilled(undefined, "init app", undefined))
  expect(endState.appInitialize).toBe(true)
})
test("should change app status", () => {
  const endState = app_reducer(appInitial, appActions.appSetStatusAC({ status: "loading" }))
  expect(endState.status).toBe("loading")
})

test("should set inform message in app", () => {
  const newInformMessage = "new inform message"
  const endState = app_reducer(appInitial, appActions.appSetInformMessageAC({ informMessage: newInformMessage }))
  expect(endState.informMessage).toStrictEqual(newInformMessage)
})
