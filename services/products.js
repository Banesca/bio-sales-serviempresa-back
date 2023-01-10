import { Api } from '.';

export const listProducts = async (
	route,
	query = { pFamily: 0, pSubFamily, businessId: 1 }
) => {
	return await Api.post(`${route}/api/v2/validator/login`, data);
};

export const getProductById = (id) => {
	console.log(id);
};

export const importProducts = async (products) => {
	return await Api.post('/back-office/products/import', products);
};
