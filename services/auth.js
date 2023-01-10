import { Api } from '.';

export const login = async (route, data) => {
	return await Api.post(`${route}/api/v1/validator/login`, data);
};
