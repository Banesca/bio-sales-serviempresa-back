import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import DashboardLayout from '../../../components/layout';
import { clients } from '../../../util/database';
import Loading from '../../../components/loading';

const ClientDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/users');
		setLoading(true);
	};

	const [client, setClient] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		// handle Request
		const filterClient = clients.filter((u) => u.id == id)[0];
		console.log(filterClient, 'Filter');
		setClient(filterClient);
		// End handle Request
		setLoading(false);
	}, [id]);

	if (!loading && !client) {
		return (
			<DashboardLayout>
				<h1 style={{ color: 'white' }}>Not found</h1>
			</DashboardLayout>
		);
	}

	console.log(client);

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
						{client?.rut}
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
						<p>Rif</p>
						<p>{client?.rif}</p>
					</List.Item>
				</List>
				<h3
					style={{
						textAlign: 'center',
						color: 'white',
					}}
				>
					Pedidos
				</h3>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default ClientDetail;
