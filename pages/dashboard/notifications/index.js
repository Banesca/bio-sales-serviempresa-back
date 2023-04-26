import React from 'react';
import DashboardLayout from '../../../components/shared/layout';
import NotificationsCards from '../../../components/notifications/NotificationsCards';

const index = () => {
	return (
		<>
			<DashboardLayout>
				<h1 className="text-5xl text-center p-8">NOTIFICACIONES</h1>
				<NotificationsCards />
			</DashboardLayout>
		</>
	);
};

export default index;
