export class PromiseWithExternalResolve<T = unknown> {
  public resolve!: (value: T | PromiseLike<T>) => void;
  public reject!: (reason?: unknown) => void;

  private promise: Promise<T>;

  constructor(callback?: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: unknown) => void) => void) {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      if (callback) {
        callback(this.resolve, this.reject);
      }
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.promise.finally(onfinally);
  }
}
