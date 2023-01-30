import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { List } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import DashboardLayout from '../../../components/layout';
import Loading from '../../../components/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';

const ClientDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/clients');
		setLoading(true);
	};

	const [client, setClient] = useState();
	const [loading, setLoading] = useState(true);

	const generalContext = useContext(GeneralContext);
	const { requestHandler } = useRequest();

	const getClientRequest = async () => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/client/get/${id}`);
		if (res.isLeft()) {
			setLoading(false);
			return message.error('Ha ocurrido un error');
		}
		const value = res.value.getValue();
		if (!value.data) {
			setLoading(false);
			return message.error('Ha ocurrido un error');
		}
		setClient(value.data)
		setLoading(false)
	};

	useEffect(() => {
		setLoading(true);
		// handle Request
		if (generalContext) {
			getClientRequest();
		}
	}, [id, generalContext]);

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
						{client?.nameClient}
					</h1>
					<div></div>
				</div>
				<h3
					style={{
						textAlign: 'center',
						color: 'white',
					}}
				>
					Información General
				</h3>
				<List style={{ width: '600px' }}>
					<List.Item>
						<p>Rif</p>
						<p>{client?.numberDocument}</p>
					</List.Item>
					<List.Item>
						<p>Teléfono</p>
						<p>{client?.phone}</p>
					</List.Item>
					<List.Item>
						<p>Estado</p>
						<p>{client?.statusName}</p>
					</List.Item>
					<List.Item>
						<p>Dirección</p>
						<p>{client?.address}</p>
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
