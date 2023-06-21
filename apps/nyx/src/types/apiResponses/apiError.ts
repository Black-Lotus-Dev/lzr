// this type is only for returning the data from the result
export default class ApiError {
	public msg = '';

	public code = '';

	public funcName = '';

	constructor(msg: string, code: string, funcName = '0') {
		this.msg = msg;
		this.code = code;
		this.funcName = funcName;
	}
}
