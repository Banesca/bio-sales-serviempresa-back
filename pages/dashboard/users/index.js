import { useEffect, useState } from 'react';

import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input, Modal, Tabs } from 'antd';

import DashboardLayout from '../../../components/layout';
import UsersTable from '../../../components/users/table';

export const profiles = {
	seller: 'seller',
	fullAccess: 'fullAccess',
	admin: 'admin',
};

export default function Users() {
	const tabs = [
		{
			label: `Vendedores`,
			key: '1',
			children: <UsersTable profile={profiles.seller} />,
		},
		{
			label: `Full Acceso`,
			key: '2',
			children: <UsersTable profile={profiles.fullAccess} />,
		},
		{
			label: `Administradores`,
			key: '3',
			children: <UsersTable profile={profiles.admin} />,
		},
	];

	const data = [
		{
			key: 1,
			firstName: 'Andre',
			lastName: 'Izarra',
			email: 'aizarra2015@gmail.com',
			business: 'Innova',
			orders: 52,
		},
	];

	useEffect(() => {}, []);


	const onTabChange = (key) => {
		console.log(key);
	};

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<Tabs
					style={{ width: '100%' }}
					defaultActiveKey="1"
					onChange={onTabChange}
					items={tabs}
				/>
			</div>
		</DashboardLayout>
	);
}
