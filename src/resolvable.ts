export class Resolvable<T> implements PromiseLike<T> {
  private promise: Promise<T>;
  private internalResolve: (value: T) => void;
  private internalReject: (error: Error) => void;

  public constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.internalResolve = resolve;
      this.internalReject = reject;
    });
  }

  public resolve(value: T): void {
    this.internalResolve(value);
  }

  public reject(error: Error): void {
    this.internalReject(error);
  }

  public then<V>(fn: (value: T) => V | PromiseLike<V>): PromiseLike<V> {
    return this.promise.then(fn);
  }
}
