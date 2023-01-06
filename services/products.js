import { Api } from ".";

export const getProducts = (filters) => {
	console.log(filters);
};

export const getProductById = (id) => {
	console.log(id);
};

export const importProducts = async (products) => {
	return await Api.post('/back-office/products/import', products)
};
