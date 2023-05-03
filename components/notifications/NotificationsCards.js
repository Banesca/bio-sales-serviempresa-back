import { WarningTwoTone } from '@ant-design/icons';
import { Card } from 'antd';
import React, { useEffect } from 'react';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { useNotification } from '../notifications/hooks/useNotifications';

const NotificationsCards = () => {
	const { selectedBusiness } = useBusinessProvider();
	const { getNotification } = useNotification();
	console.log(selectedBusiness.idSucursal);

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
