import { Api } from '.';

export const login = async (data) => {
	try {
		return await Api.post('/auth/login', data);
	} catch (error) {
		console.log(error)
	}
};
