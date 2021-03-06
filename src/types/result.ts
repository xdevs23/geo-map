export enum ResultType {
  Queued = 'queued',
  Failure = 'failure',
  Success = 'success'
}

export type Result<T> = QueuedResult | SuccessResult<T> | FailureResult;

export interface ResultBase {
  type: ResultType;
}

export interface QueuedResult extends ResultBase {
  type: ResultType.Queued;
  startedAt: Date;
}

export interface SuccessResult<T> extends ResultBase {
  type: ResultType.Success;
  payload: T;
}

export interface FailureResult extends ResultBase {
  type: ResultType.Failure;
  error: Error;
}
