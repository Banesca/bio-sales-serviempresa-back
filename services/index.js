import axios from 'axios';

import { environment } from '../util/environment';
import { Result, left, right } from '../util/result';

export class Api {
	static async get(route, params = {}) {
		try {
			const response = await axios.get(route, { params });
			return response.data;
		} catch (error) {}
	}

	static async post(route, data) {
		try {
			const response = await axios.post(route, data);
			return right(Result.ok(response.data));
		} catch (error) {
			return left(Result.fail(error.response));
		}
	}
}
