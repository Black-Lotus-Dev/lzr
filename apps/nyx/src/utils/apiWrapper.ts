import ApiError from '../types/apiResponses/apiError';
import { ApiResult, ApiResultHandler } from '../types/apiResponses/apiReturn';

type WrappedFunction<T> = () => Promise<T>;

/** error handler to catch and return errors instead of breaking.
 * @param {function} f is the function we are intending to run
 */
export default async function apiErrorHandlerWrapper<T>(
	f: WrappedFunction<T>
): Promise<ApiResult<T>> {
	const apiResult: ApiResultHandler<T> = new ApiResultHandler<T>(f.name);

	await f()
		.then((data: T) => {
			apiResult.setData(data);
		})
		.catch((err: string | ApiError) => {
			apiResult.setError(err);
		});

	return apiResult.result;
}
