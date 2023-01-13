import { useContext, useEffect } from 'react';

import { Tabs } from 'antd';

import DashboardLayout from '../../../components/layout';
import UsersTable from '../../../components/users/table';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';

export const profiles = {
	seller: 'seller',
	fullAccess: 'fullAccess',
	admin: 'admin',
};

export default function Users() {
	const { requestHandler } = useRequest();

	const getUsersRequest = async () => {
		const res = await requestHandler.get(`/api/v2/user`);
		if (res.isLeft()) {
			console.log(res.value.getErrorValue());
			return
		}
		const value = res.value.getValue();
		console.log(value);
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		if (generalContext) {
			getUsersRequest();
		}
	}, []);

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
