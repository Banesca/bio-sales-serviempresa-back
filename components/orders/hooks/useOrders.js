import { useEffect, useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';
import { addKeys } from '../../../util/setKeys';

export function useOrders() {
	const [orders, setOrders] = useState([]);
	const [currentOrder, setCurrentOrder] = useState();
	const [user, setUser] = useState();

	const { requestHandler } = useRequest();

	const getOrders = async ({ idBranchFk, dateStart, dateEnd }) => {
		const res = await requestHandler.post('/api/v2/order/lite', {
			idBranchFk,
			dateStart: dateStart || new Date(2023, 0, 1),
			dateEnd: dateEnd || new Date(),
		});

		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		addKeys(value);
		setOrders(value);
	};

	const getOrderById = async (id) => {
		const res = await requestHandler.get(`/api/v2/order/byidH/${id}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data;
		setCurrentOrder(value);
		await getOrderUser(value.idUser);
	};

	const getOrderUser = async (userId) => {
		const res = await requestHandler.get(`/api/v2/user/${userId}`);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		const value = res.value.getValue().data[0];
		setUser(value);
	};

	const changeStatus = async (status, orderId) => {
		const res = await requestHandler.get(
			`/api/v2/order/satus/${orderId}/${status}`
		);
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		await getOrderById(orderId);
	};

	useEffect(() => {
		console.log(currentOrder);
	}, [currentOrder]);

	return {
		orders,
		currentOrder,
		user,
		getOrderById,
		getOrders,
		changeStatus,
	};
}
