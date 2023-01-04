import { Api } from '.';

export const getSellers = async () => {
	const users = await Api.get('/back-office/users/seller');
	console.log(users, 'from function');
	return users;
};

export const getAdmins = async () => {
	return await Api.get('/back-office/users/admin');
};

export const getFullAccess = async () => {
	return await Api.get('/back-office/users/full-access');
};
