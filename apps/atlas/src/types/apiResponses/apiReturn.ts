import ApiError from './apiError';

export type ApiResult<T> = T | ApiError;

export class ApiResultHandler<T> {
  private funcName = '0';

  private data: T[] = [];

  private error: ApiError = new ApiError('0', '0', '0');

  private hasError = false;

  constructor(funcName: string) {
    this.funcName = funcName;
  }

  public get result() {
    if (!this.hasError) return this.data[0];
    return this.error;
  }

  public setData(data: T) {
    this.data.push(data);
    return this;
  }

  private configureError(err: ApiError | string) {
    if (err instanceof ApiError) return err;
    return new ApiError(err, '000', this.funcName);
  }

  public setError(err: ApiError | string) {
    this.error = this.configureError(err);
    this.hasError = true;
    return this;
  }
}
export { ApiError };
