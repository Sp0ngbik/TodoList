import { appActions, appReducer, asyncApp, T_AppReducer } from "../model/appSlice"

let appInitial: T_AppReducer

beforeEach(() => {
  appInitial = {
    status: "idle",
    appInitialize: false,
    informMessage: null,
  }
})

test("should init app", () => {
  const endState = appReducer(appInitial, asyncApp.fetchInitApp.fulfilled(undefined, "init app", undefined))
  expect(endState.appInitialize).toBe(true)
})
test("should change app status", () => {
  const endState = appReducer(appInitial, appActions.appSetStatusAC({ status: "loading" }))
  expect(endState.status).toBe("loading")
})

test("should set inform message in app", () => {
  const newInformMessage = "new inform message"
  const endState = appReducer(appInitial, appActions.appSetInformMessageAC({ informMessage: newInformMessage }))
  expect(endState.informMessage).toStrictEqual(newInformMessage)
})
