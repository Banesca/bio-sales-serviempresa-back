import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';

export function useProducts() {
	const { requestHandler } = useRequest();

	const [products, setProducts] = useState();

	const getProducts = async (businessId = 1) => {
		const response = await requestHandler.get(
			`/api/v2/product/list/0/0/${businessId}`
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		const value = response.value.getValue().data;
		setProducts(value);
	};

	return {
		products,
		getProducts,
	};
}
