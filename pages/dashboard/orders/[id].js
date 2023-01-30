import { ArrowLeftOutlined } from '@ant-design/icons';
import DashboardLayout from '../../../components/layout';
import { Col, List, Row, Table } from 'antd';
import Loading from '../../../components/loading';
import { useRequest } from '../../../hooks/useRequest';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GeneralContext } from '../../_app';
import { message } from 'antd';
import { Typography } from 'antd';

const OrderDetail = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'barCode',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 1,
			render: (text) => <p>$ {text}</p>,
		},
		{
			title: 'Cantidad',
			dataIndex: 'weight',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Sub Total',
			dataIndex: 'weight',
			key: 3,
			render: (quantity, record) => (
				<p>$ {record.priceSale * quantity}</p>
			),
		},
	];

	const router = useRouter();
	const { id } = router.query;

	const [loading, setLoading] = useState(true);
	const [order, setOrder] = useState({});
	const [user, setUser] = useState({});

	const handleReturn = () => {
		setLoading(true);
		router.push('/dashboard/orders');
	};

	const { requestHandler } = useRequest();

	const generalContext = useContext(GeneralContext);

	const getOrderRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/order/byidH/${id}`);
		console.log(res.value);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setOrder(value);
		await getUserRequest(value.idUser);
		setLoading(false);
	};

	const getUserRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/${id}`);
		console.log(res.value);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data[0];
		setUser(value);
	};

	useEffect(() => {
		if (generalContext) {
			getOrderRequest(id);
		}
	}, [generalContext, id]);

	if (loading) {
		return (
			<DashboardLayout>
				<Loading isLoading={loading} />
			</DashboardLayout>
		);
	}

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
						Información General
					</h1>
					<div></div>
				</div>
				<List style={{ width: '100%' }}>
					<List.Item>
						<p>Numero de Orden</p>
						<p>{order.numberOrden}</p>
					</List.Item>
					<List.Item>
						<p>Usuario - Vendedor</p>
						<p>{user.fullname}</p>
					</List.Item>
					<List.Item>
						<p>Estado</p>
						<p>{order.statusOrder}</p>
					</List.Item>
					<List.Item>
						<p>Cliente</p>
						<p>{order.fullNameClient}</p>
					</List.Item>
					<List.Item>
						<p>Numero de teléfono - Cliente</p>
						<p>{order.phoneClient}</p>
					</List.Item>
					<List.Item>
						<p>Dirección</p>
						<p>{order.address}</p>
					</List.Item>
					<List.Item>
						<p>Fecha de creación</p>
						<p>{new Date(order.fechaEntrega).toLocaleDateString()}</p>
					</List.Item>
				</List>
				<Table
					style={{ width: '100%' }}
					columns={columns}
					dataSource={order?.body}
					loading={loading}
					title={() => (
						<Typography
							style={{
								fontSize: '1.5rem',
								fontWeight: 'bold',
							}}
						>
							Productos
						</Typography>
					)}
					footer={() => (
						<Row>
							<Col span={12}>
								<Typography
									style={{
										fontSize: '1.2rem',
										fontWeight: 'bold',
									}}
								>
									Total
								</Typography>
							</Col>
							<Col span={12}>
								<Typography
									style={{
										textAlign: 'end',
										fontSize: '1.2rem',
										fontWeight: 'bold',
										marginRight: '2rem',
									}}
								>
									$ {order?.totalBot}
								</Typography>
							</Col>
						</Row>
					)}
				/>
			</div>
		</DashboardLayout>
	);
};

export default OrderDetail;
