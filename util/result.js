/* eslint-disable quotes */
export class Result {
	isSuccess;
	isFailure;
	error;
	_value;

	constructor(isSuccess, error, value) {
		if (isSuccess && error) {
			throw new Error(
				'InvalidOperation: A result cannot be successful and contain an error'
			);
		}
		if (!isSuccess && !error) {
			throw new Error(
				'InvalidOperation: A failing result needs to contain an error message'
			);
		}

		this.isSuccess = isSuccess;
		this.isFailure = !isSuccess;
		this.error = error;
		this._value = value;

		Object.freeze(this);
	}

	getValue() {
		if (!this.isSuccess) {
			throw new Error(
				"Can't get the value of an error result. Use 'errorValue' instead."
			);
		}

		return this._value;
	}

	getErrorValue() {
		return this.error;
	}

	static ok(value) {
		return new Result(true, null, value);
	}

	static fail(error = 'Ha ocurrido un error') {
		return new Result(false, error, {});
	}

	static combine(results) {
		for (const result of results) {
			if (result.isFailure) return result;
		}
		return Result.ok();
	}
}

export class Left {
	value;

	constructor(value) {
		this.value = value;
	}

	isLeft() {
		return true;
	}

	isRight() {
		return false;
	}
}

export class Right {
	value;

	constructor(value) {
		this.value = value;
	}

	isLeft() {
		return false;
	}

	isRight() {
		return true;
	}
}

export const left = (l) => {
	return new Left(l);
};

export const right = (a) => {
	return new Right(a);
};
