export interface Future<T> {
  promise: Promise<T>;
  resolve: (v?: T | PromiseLike<T>) => void;
  reject: (r?: any) => void;
}

export function future<T = unknown>(): Future<T> {
  const f: Future<T> = {} as Future<T>;
  f.promise = new Promise<T>((rs, rj) => {
    f.resolve = rs;
    f.reject = rj;
  });
  return f;
}
