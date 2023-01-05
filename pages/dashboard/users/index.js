import { useEffect } from 'react';

import { Tabs } from 'antd';

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
					items={tabs}
				/>
			</div>
		</DashboardLayout>
	);
}
