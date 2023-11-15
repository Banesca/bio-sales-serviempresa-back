/* eslint-disable indent */
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, ConfigProvider, List, Table } from 'antd';
import { EditOutlined, LeftOutlined } from '@ant-design/icons';
import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';
import { Space } from 'antd';
import { orderStatusToUse } from '../orders';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';

const ClientDetail = () => {
	const columns = [
		{
			title: 'Pedido N#',
			dataIndex: 'numberOrden',
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
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>
			),
		},
		{
			title: 'Fecha de creación',
			dataIndex: 'created_at',
			key: 1,
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
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>
			),
		},
		{
			title: 'Ultima actualización',
			dataIndex: 'updated_at',
			key: 2,
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
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>
			),
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
								{orderStatusToUse[record.idStatusOrder].state}
							</p>
						);
					case 2:
						return (
							<p style={{ color: '#06a800', fontWeight: 'bold' }}>
								{orderStatusToUse[record.idStatusOrder].state}
							</p>
						);
					case 3:
						return (
							<p style={{ color: '#0984e3', fontWeight: 'bold' }}>
								{orderStatusToUse[record.idStatusOrder].state}
							</p>
						);
					case 4:
						return (
							<p style={{ color: '#ffd034', fontWeight: 'bold' }}>
								{orderStatusToUse[record.idStatusOrder].state}
							</p>
						);
					case 5:
						return (
							<p style={{ color: '#d63031', fontWeight: 'bold' }}>
								{orderStatusToUse[record.idStatusOrder].state}
							</p>
						);
				}
			},
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 4,
			render: (order) => (
				<Space
					size="middle"
					display={{ display: 'flex', justifyContent: 'center' }}
				>
					{' '}
					{order.idStatusOrder == 1 ? (
						<Button onClick={() => handleSeeDetail(order)}>
							<EditOutlined />
						</Button>
					) : (
						<></>
					)}
				</Space>
			),
		},
	];

	const columns2 = [
		{
			title: 'Nombre del cliente',
			dataIndex: 'fullNameClient',
			key: 1,
		},
		{
			title: 'Deuda',
			dataIndex: 'Deuda',
			key: 2,
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
	const [debts, setdebts] = useState([]);

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
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	const getDebtsbyClient = async (phoneNumber) => {
		setLoading(true);
		console.log(phoneNumber);
		let id = phoneNumber;
		try {
			const res = await requestHandler.post(`/api/v2/wallet/get/",${phoneNumber}"/1000`);
		
			if (res.isLeft()) {
				throw res.value.getErrorValue();
			}
			const value = res.value.getValue().data;
			console.log(value);
			setdebts(value);
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
		
	};

	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length) {
			getClientRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, generalContext]);

	useEffect(() => {
		if (Object.keys(client).length) {
			getOrderByClient(client.phone);
			getDebtsbyClient(client.phone);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client]);

	return (
		<DashboardLayout>
			<div className="flex gap-5 m-4 flex-col">
				<div className="flex w-full justify-between">
					<Button className="h-11 rounded-3xl" onClick={handleReturn}>
						<LeftOutlined style={{ fontSize: '1.5rem', marginRight: '50%' }} />
					</Button>
					<div
						className="uppercase text-center font-medium text-4xl
					"
					>
						{client?.nameClient}
					</div>
					<div className="w-10"></div>
				</div>
				<Card className="rounded-2xl shadow-md">
					<h2 className="text-2xl text-center font-semibold"></h2>
					<List>
						<List.Item style={{ padding: '10px 25px' }}>
							<p style={{ fontWeight: 'bold' }}>RIF:</p>
							<p>{client?.numberDocument}</p>
						</List.Item>
						<List.Item style={{ padding: '10px 25px' }}>
							<p style={{ fontWeight: 'bold' }}>Número de Teléfono:</p>
							<p>{client?.phone}</p>
						</List.Item>
						<List.Item style={{ padding: '10px 25px' }}>
							<p style={{ fontWeight: 'bold' }}>Estado:</p>
							<p
								style={{
									color: `${
										client?.statusName == 'Eliminado' ? 'red' : 'black'
									}`,
								}}
							>
								{client?.statusName}
							</p>
						</List.Item>
						<List.Item style={{ padding: '10px 25px' }}>
							<p style={{ fontWeight: 'bold' }}>Dirección:</p>
							<p>{client?.address}</p>
						</List.Item>
						<List.Item style={{ padding: '10px 25px' }}>
							<div style={{ fontWeight: 'bold' }}>
								Observación:
								<div style={{ fontWeight: '400', textAlign: 'justify' }}>
									{client?.observacion}
								</div>
							</div>
						</List.Item>
					</List>
				</Card>
				<div className="flex flex-col gap-5">
					<h3 className="text-4xl text-center">Ordenes</h3>
					<ConfigProvider
						renderEmpty={
							orders.length !== 0 || true ? CustomizeRenderEmpty : ''
						}
					>
						<Table loading={loading} columns={columns} dataSource={orders} />
					</ConfigProvider>
				</div>

				<div className="flex flex-col gap-5">
					<h3 className="text-4xl text-center">Deudas</h3>
					<ConfigProvider>
						<Table loading={loading} columns={columns2} dataSource={debts} />
					</ConfigProvider>
				</div>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default ClientDetail;
