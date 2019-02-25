export interface MockFnType<T> {
  (...args: unknown[]): T;
  mock: {
    calls: unknown[][];
  };
}

export function MockFn<T = unknown>(): MockFnType<T> {
  const mock: MockFnType<T>['mock'] = {
    calls: []
  };
  const ret = (((...args: unknown[]) => {
    mock.calls.push(args);
  }) as any) as MockFnType<T>;
  ret.mock = mock;
  return ret;
}
