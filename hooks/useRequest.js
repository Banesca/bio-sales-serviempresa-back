import axios from 'axios';
import { useContext } from 'react';
import { GeneralContext } from '../pages/_app';
import { ip } from '../util/environment';
import { Result, left, right } from '../util/result';
import https from 'https';

export function useRequest() {
	const generalContext = useContext(GeneralContext);

	const requestHandler = {
		get: async (route, params) => {
			console.log(route);
			try {
				const httpsAgent = new https.Agent({
					rejectUnauthorized: false,
				});
				const response = await axios.get(
					`${ip}:${generalContext.api_port}${route}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
							'Access-Control-Allow-Origin': '*',
						},
						httpsAgent,
					}
				);

				return right(Result.ok(response.data));
			} catch (error) {
				console.log(error);
				return left(Result.fail(error));
			}
		},
		post: async (route, data) => {
			try {
				const response = await axios.post(
					`${ip}:${generalContext.api_port}${route}`,
					data,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
						},
					}
				);

				return right(Result.ok(response.data));
			} catch (error) {
				return left(Result.fail(error));
			}
		},
		put: async (route, data) => {
			try {
				const response = await axios.put(
					`${ip}:${generalContext.api_port}${route}`,
					data,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
						},
					}
				);

				return right(Result.ok(response));
			} catch (error) {
				return left(Result.fail(error));
			}
		},
		patch: async (route) => {
			try {
				const response = await axios.patch(
					`${ip}:${generalContext.api_port}${route}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
						},
						params,
					}
				);

				return right(Result.ok(response));
			} catch (error) {
				return left(Result.fail(error));
			}
		},
		delete: async (route) => {
			try {
				const response = await axios.delete(
					`${ip}:${generalContext.api_port}${route}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								'accessToken'
							)}`,
						},
					}
				);

				return right(Result.ok(response));
			} catch (error) {
				return left(Result.fail(error));
			}
		},
	};

	return {
		requestHandler,
	};
}
