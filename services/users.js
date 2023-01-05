import { Api } from '.';

export const getSellers = async (limit = 50, page = 1) => {
	try {
		const users = await Api.get('/back-office/users/seller', {
			limit,
			page,
		});
		return users;
	} catch (error) {
		console.log(error);
	}
};

export const getAdmins = async () => {
	return await Api.get('/back-office/users/admin');
};

export const getFullAccess = async () => {
	return await Api.get('/back-office/users/full-access');
};
