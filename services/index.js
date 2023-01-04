import { environment } from '../environment';

export class Api {
	static url = environment.api;

	static async get(route) {
		const response = await fetch(`${this.url}${route}`);
		const data = await response.json();
		return data;
	}

	static post() {}

	static put() {}

	static delete() {}
}
