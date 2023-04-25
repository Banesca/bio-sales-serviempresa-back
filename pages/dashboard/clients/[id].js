import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, ConfigProvider, Empty, List, Table } from 'antd';
import { ArrowLeftOutlined, EditOutlined, EyeTwoTone, LeftOutlined } from '@ant-design/icons';

import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';
import { Space } from 'antd';
import { orderStatusToUse } from '../orders';

const ClientDetail = () => {
	const columns = [
		{
			title: 'Fecha de creación',
			dataIndex: 'created_at',
			key: 0,
			sorter: (a, b) => {
				let aYear = a.created_at.substring(0, 4);
				let bYear = b.created_at.substring(0, 4);

				let aMonth = a.created_at.substring(5, 7);
				let bMonth = b.created_at.substring(5, 7);

				let aDay = a.created_at.substring(5, 7);
				let bDay = b.created_at.substring(8, 10);

				let aDate = new Date(aYear, aMonth, aDay);
				let bDate = new Date(bYear, bMonth, bDay);

				return aDate.getTime() - bDate.getTime();
			},
			showSorterTooltip: false,
			render: (text) => <p>{text.slice(0, 10).split('-').reverse().join('-')}</p>,
		},
		{
			title: 'Ultima actualización',
			dataIndex: 'updated_at',
			key: 0,
			sorter: (a, b) => {
				let aYear = a.updated_at.substring(0, 4);
				let bYear = b.updated_at.substring(0, 4);

				let aMonth = a.updated_at.substring(5, 7);
				let bMonth = b.updated_at.substring(5, 7);

				let aDay = a.updated_at.substring(5, 7);
				let bDay = b.updated_at.substring(8, 10);

				let aDate = new Date(aYear, aMonth, aDay);
				let bDate = new Date(bYear, bMonth, bDay);

				return aDate.getTime() - bDate.getTime();
			},
			showSorterTooltip: false,
			render: (text) => <p>{text.slice(0, 10).split('-').reverse().join('-')}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'statusOrder',
			key: 3,
			render: (text, record) => {
				switch (record.idStatusOrder) {
				case 1:
					return (
						<p style={{ color: '#ff6c0b', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 2:
					return (
						<p style={{ color: '#06a800', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 3:
					return (
						<p style={{ color: '#0984e3', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 4:
					return (
						<p style={{ color: '#ffd034', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 5:
					return (
						<p style={{ color: '#d63031', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				}
			},
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 5,
			render: (order) => (
				<Space size="middle" display={{display: 'flex', justifyContent: 'center'}}>
					<Button
						onClick={() => handleSeeDetail(order)}
					>
						<EditOutlined />
					</Button>
				</Space>
			),
		},
	];

	const handleSeeDetail = (order) => {
		setLoading(true);
		router.push(`/dashboard/orders/${order.idOrderH}`);
	};

	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/clients');
		setLoading(true);
	};

	const [client, setClient] = useState({});
	const [orders, setOrders] = useState([]);

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
			return message.error('Cliente no encontrado');
		}
		setClient(value.data);
	};

	const getOrderByClient = async (phoneNumber) => {
		setLoading(true);
		try {
			const res = await requestHandler.post('/api/v2/order/byclient', {
				query: phoneNumber,
			});
			if (res.isLeft()) {
				throw res.value.getErrorValue();
			}
			const value = res.value.getValue().data;
			setOrders(value);
		} catch (error) {
			message.error('Ha ocurrido un error')
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		// handle Request
		if (Object.keys(generalContext).length) {
			getClientRequest();
		}
	}, [id, generalContext]);

	useEffect(() => {
		if (Object.keys(client).length) {
			getOrderByClient(client.phone);
		}
	}, [client]);

	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>
			
		</Empty>
	);

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
					display: 'flex'
				}}
			>
				<h1
					style={{
						textAlign: 'center',
						fontSize: '2.5rem',
						margin: '0px',
						display: 'flex',
						width: '100%'
					}}
				>
					<Button style={{marginRight: '50%', height: '42px', borderRadius: '20px'}} onClick={handleReturn}>
						<LeftOutlined
							style={{ fontSize: '1.5rem', marginRight: '50%'}}
								
								
						/>
					</Button>
					<div style={{marginLeft: '-140px'}}>
						{client?.nameClient}
					</div>

				</h1>
				<h2
					style={{
						textAlign: 'center',
						marginTop: '5px'
					}}
				>
					Información General
				</h2>
				<div
					style={{
						width: '100%',
						marginTop: '10px',
						display: 'flex',
						flexDirection: 'column',
						backgroundColor: 'white',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
				</div>
				<List style={{backgroundColor: 'white', borderRadius: '15px', boxShadow: '4px 4px 8px rgba(180, 180, 180, 0.479)'}}>
					<List.Item style={{padding: '10px 25px'}}>
						<p style={{fontWeight: 'bold'}}>Rif</p>
						<p>{client?.numberDocument}</p>
					</List.Item>
					<List.Item style={{padding: '10px 25px'}}>
						<p style={{fontWeight: 'bold'}}>Teléfono</p>
						<p>{client?.phone}</p>
					</List.Item>
					<List.Item style={{padding: '10px 25px'}}>
						<p style={{fontWeight: 'bold' }}>Estado</p>
						<p style={{color: `${client?.statusName == 'Eliminado' ? 'red' : 'black'}`}}>{client?.statusName}</p>
					</List.Item>
					<List.Item style={{padding: '10px 25px'}}>
						<p style={{fontWeight: 'bold'}}>Dirección</p>
						<p>{client?.address}</p>
					</List.Item>
				</List>
				<h3
					style={{
						textAlign: 'center',
						fontSize: '1.5rem'
					}}
				>
					Pedidos
				</h3>
				<ConfigProvider renderEmpty={customizeRenderEmpty}>
					<Table
						loading={loading}
						columns={columns}
						dataSource={orders}
					/>
				</ConfigProvider>

			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default ClientDetail;