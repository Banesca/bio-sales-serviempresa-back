import { Api } from '.';

export const getBusiness = async () => {
	return await Api.get('/business');
};
