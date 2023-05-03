import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';

export function useProducts() {
	const { requestHandler } = useRequest();
	const [notification, setNotification] = useState();

	const sendNotification = async (businessId) => {
		const response = await requestHandler.post(
			'/api/v2/utils/notification/add',
			{
				title: 'Notificacion de prueba desde el back',
				description: 'Esto solo es una prueba',
				idSucursalFk: businessId,
			}
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		const value = response.value.getValue().data;
		console.log(value);
	};

	const getNotification = async (businessId) => {
		const response = await requestHandler.get(
			`/api/v2/utils/notification/all/${businessId}`
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		const value = response.value.getValue().data;
		console.log(value);
		setNotification(value);
	};

	return {
		sendNotification,
		getNotification,
	};
}
