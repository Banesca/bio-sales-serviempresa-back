import React from 'react';
import DashboardLayout from '../../../components/shared/layout';
import NotificationsCards from '../../../components/notifications/NotificationsCards';
import Title from '../../../components/shared/title';

const index = () => {
	return (
		<>
			<DashboardLayout>
				<div className="p-4 m-4">
					<Title title={'Notificaciones'} goBack={false}></Title>
					<NotificationsCards />
				</div>
			</DashboardLayout>
		</>
	);
};

export default index;
