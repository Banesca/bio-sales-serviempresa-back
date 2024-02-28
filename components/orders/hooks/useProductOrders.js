import { useRequest } from '../../../hooks/useRequest';

export function useProductOrders() {
	const { requestHandler } = useRequest();

	const getOrderById = async (id) => {
		const res = await requestHandler.get(`/api/v2/order/byidH/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
	};

	const addProduct = async ({
		idOrderHFk,
		idProductFk,
		idUserAddFk,
		priceProductOrder,
	}) => {
		const res = await requestHandler.post('/api/v2/order/product/add', {
			idOrderHFk,
			idProductFk,
			idStatusFk: 1,
			idUserAddFk,
			priceProductOrder,
			quantityProduct: 1,
		});
		console.log(res)

		const body = {
			data:res.value._value,
			idOrderHFk: idOrderHFk

		}

		if (res.isRight()) {
			return body
		}
		
		 
	};

	return {
		addProduct,
	};
}
