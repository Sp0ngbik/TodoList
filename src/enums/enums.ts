export enum ResultCode {
  success = 0,
  error = 1,
  captcha = 10,
}

export enum TasksStatus {
  New,
  InProgress,
  Completed,
  Draft,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
