import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import DashboardLayout from '../../../components/layout';
import { users } from '../../../util/database';
import Loading from '../../../components/loading';

const UserDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/users');
		setLoading(true);
	};

	const [user, setUser] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		// handle Request
		const filterUser = users.filter((u) => u.id == id)[0];
		console.log(filterUser, 'Filter');
		setUser(filterUser);
		// End handle Request
		setLoading(false);
	}, []);

	if (!loading && !user) {
		return (
			<DashboardLayout>
				<h1 style={{ color: 'white' }}>Not found</h1>
			</DashboardLayout>
		);
	}

	console.log(user, 'User');
	console.log(users, 'Users');

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<ArrowLeftOutlined
						style={{ fontSize: '1.5rem', color: 'white' }}
						onClick={handleReturn}
					/>
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							color: 'white',
						}}
					>
						{user?.firstName} {user?.lastName}
					</h1>
					<div></div>
				</div>
				<h3
					style={{
						textAlign: 'center',
						color: 'white',
					}}
				>
					Informacion General
				</h3>
				<List style={{ width: '600px' }}>
					<List.Item>
						<p>Email</p>
						<p>{user?.email}</p>
					</List.Item>
					<List.Item>
						<p>Empresa</p>
						<p>{user?.business}</p>
					</List.Item>
					<List.Item>
						<p>Cuota</p>
						<p>120$ / 200$</p>
					</List.Item>
					<List.Item>
						<p>Pedidos Pendientes</p>
						<p>2</p>
					</List.Item>
					<List.Item>
						<p>Pedidos Cancelados</p>
						<p>1</p>
					</List.Item>
					<List.Item>
						<p>Ventas realizadas</p>
						<p>20</p>
					</List.Item>
					<List.Item>
						<p>Total Vendido</p>
						<p>300$</p>
					</List.Item>
				</List>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default UserDetail;
