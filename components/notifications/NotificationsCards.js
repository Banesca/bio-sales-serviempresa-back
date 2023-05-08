import { WarningTwoTone } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { useRequest } from '../../hooks/useRequest';

const NotificationsCards = () => {
	/* 	const { selectedBusiness } = useBusinessProvider();
	console.log(selectedBusiness.idSucursal);

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

	useEffect(() => {
		getNotification(selectedBusiness.idSucursal);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []) */

	return (
		<div className="flex gap-4 flex-col">
			<Card className="w-full shadow-md">
				<div className="flex flex-row gap-5">
					<div className="flex justify-center items-center">
						<WarningTwoTone className="text-4xl" />
					</div>
					<div>
						<h1 className="text-xl font-medium">
							Esta es una notificacion de prueba
						</h1>
						<p>
							Esta notificacion fue creada con fines de prueba desde el
							backoffice, por favor no se alarme si ve esta notificacion, aun
							estamos en produccion, mantenga la calma
						</p>
					</div>
				</div>
			</Card>
			<Card className="w-full shadow-md">
				<div className="flex flex-row gap-5">
					<div className="flex justify-center items-center">
						<WarningTwoTone className="text-4xl" />
					</div>
					<div>
						<h1 className="text-xl font-medium">
							Esta tambien es una notificacion de prueba
						</h1>
						<p>
							Esta notificacion fue creada con fines de prueba desde el
							backoffice, por favor no se alarme si ve esta notificacion, aun
							estamos en produccion, mantenga la calma por favor
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default NotificationsCards;
