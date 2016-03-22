export class Deferred<T> {
  reject: Function;
  resolve: Function;
  promise: Promise<T>;

  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
