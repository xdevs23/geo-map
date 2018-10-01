// tslint:disable:no-any
import * as Mobx from 'mobx';
import * as Types from '../types';

export function createResult(): Types.QueuedResult {
  return Mobx.observable({
    type: Types.ResultType.Queued,
    startedAt: new Date()
  }) as Types.QueuedResult;
}

export function createSuccess<T>(payload?: T): Types.SuccessResult<T> {
  return Mobx.observable({
    type: Types.ResultType.Success,
    payload
  }) as Types.SuccessResult<T>;
}

export const createFailure = Mobx.action((error: Error): Types.FailureResult => {
  return Mobx.observable({
    type: Types.ResultType.Failure,
    error
  }) as Types.FailureResult;
});

export function from<T = any>(data: any): Types.Result<T> {
  if (data.type === Types.ResultType.Failure) {
    return createFailure(data.error);
  }

  if (data.type === Types.ResultType.Success) {
    return createSuccess(data.payload);
  }

  return createResult();
}

export const toFailure = Mobx.action((
  result: Types.Result<any>,
  error: Error
): Types.FailureResult => {
  const failure = result as any;
  delete failure.startedAt;
  delete failure.payload;
  failure.type = Types.ResultType.Failure;
  failure.error = error;
  return failure as Types.FailureResult;
});

export const toSuccess = Mobx.action(<T>(
  result: Types.Result<any>,
  payload: T
): Types.SuccessResult<T> => {
  const success = result as any;
  delete success.startedAt;
  delete success.error;
  success.type = Types.ResultType.Success;
  success.payload = payload;
  return success as Types.SuccessResult<T>;
});

export const toQueued = Mobx.action((result: Types.Result<any>): Types.QueuedResult => {
  const queued = result as any;
  delete queued.payload;
  delete queued.error;
  queued.type = Types.ResultType.Queued;
  queued.startedAt = new Date();
  return queued as Types.QueuedResult;
});

export const collect = <T>(
  result: Types.Result<T>
): Promise<Types.ResultType[]> => {
  return new Promise((resolve) => {
    const states: Types.ResultType[] = [];

    const dispose = Mobx.autorun(() => {
      states.push(result.type);

      if (
        result.type === Types.ResultType.Success ||
        result.type === Types.ResultType.Failure
      ) {
        resolve(states);
        if (typeof dispose === 'function') {
          dispose();
        }
      }
    });
  });
};

export const wait = <T>(
  result: Types.Result<T>
): Promise<Types.SuccessResult<T> | Types.FailureResult> => {
  return new Promise((resolve) => {
    const dispose = Mobx.autorun(() => {
      if (
        result.type === Types.ResultType.Success ||
        result.type === Types.ResultType.Failure
      ) {
        resolve(result);
        if (typeof dispose === 'function') {
          dispose();
        }
      }
    });
  });
};
