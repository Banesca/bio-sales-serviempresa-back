import axios from 'axios';

import { environment } from '../environment';
import { Result, left, right } from '../util/result';

export class Api {
	static url = environment.api;

	static async get(route, params = {}) {
		try {
			const response = await axios.get(`${this.url}${route}`, { params });
			return response.data;
		} catch (error) {}
	}

	static async post(route, data) {
		try {
			const response = await axios.post(`${this.url}${route}`, data);
			console.log(response);
			return right(Result.ok(response.data));
		} catch (error) {
			return left(Result.fail(error.response));
		}
	}
}
