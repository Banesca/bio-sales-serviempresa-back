import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import {
	Col,
	Collapse,
	Row,
	Button,
	Space,
	Modal,
	Table,
	Form,
	Select,
	DatePicker,
} from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/layout';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/loading';
import { useRouter } from 'next/router';
import { addKeys } from '../../../util/setKeys';
import Link from 'next/link';

export default function OrdersPage() {
	const columns = [
		{
			title: 'Fecha de creación',
			dataIndex: 'created_at',
			key: 0,
			render: (text) => <p>{text.split(' ', 1)}</p>,
		},
		{
			title: 'Ultima actualización',
			//dataIndex: 'updated_at',
			key: 0,
			render: (text) => <p></p>,
		},
		{
			title: 'Vendedor',
			dataIndex: 'fullname',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cliente',
			dataIndex: 'fullNameClient',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'statusOrder',
			key: 3,
			render: (text, record) => {
				switch (record.idStatusOrder) {
					case 1:
						return <p style={{ color: '#0984e3' }}>{text}</p>;
					case 2:
						return <p style={{ color: '#00b894' }}>{text}</p>;
					case 3:
						return <p style={{ color: '#0984e3' }}>{text}</p>;
					case 4:
						return <p style={{ color: '#d63031' }}>{text}</p>;
				}
			},
		},
		{
			title: 'Acciones',
			key: 5,
			render: (_, record) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() =>
							router.push(`/dashboard/orders/${_.idOrderH}`)
						}
					>
						<EyeTwoTone />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [environmentList, setEnvironmentList] = useState([]);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const [query, setQuery] = useState({
		idStatusOrder: 0,
		startDate: null,
		endDate: null,
	});

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const { requestHandler } = useRequest();

	const { selectedBusiness } = useBusinessProvider();

	const listByBusiness = async (id) => {
		console.log(id);
		setLoading(true);
		const res = await requestHandler.get(
			`/api/v2/environment/listarPorSucursal/${id}`
		);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		const value = res.value.getValue().data;
		setEnvironmentList(value);
		let dateStart = new Date(2023, 0, 1);
		let dateEnd = new Date();
		console.log(value, 'value', 'id', id);
		if (value) {
			await getOrdersRequest({
				idBranchFk: selectedBusiness.idSucursal,
				dateStart,
				dateEnd,
			});
		}
		setLoading(false);
	};

	const getOrdersRequest = async (data) => {
		setLoading(true);
		const res = await requestHandler.post('/api/v2/order/lite', data);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		const value = res.value.getValue().data;
		setOrders(value);
		setLoading(false);
	};

	const generalContext = useContext(GeneralContext);

	useEffect(() => {
		if (generalContext && selectedBusiness) {
			let dateStart = new Date(2023, 0, 1);
			let dateEnd = new Date();
			getOrdersRequest({
				idBranchFk: selectedBusiness.idSucursal,
				dateStart,
				dateEnd,
			});
			listByBusiness(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	// useEffect(() => {
	// 	if (environmentList) {
	// 		getOrdersRequest({
	// 			idBranchFk: environmentList[0]?.idBranchFk,
	// 			dateStart: new Date('2023-1-15'),
	// 			dateEnd: new Date(),
	// 		});
	// 		getOrderStatus();
	// 	}
	// }, [environmentList]);

	// get order status
	const getOrderStatus = async () => {
		const res = await requestHandler.get(`/api/v2/order/getStatusOrder`);
		// console.log('Order Status', res);
	};

	const orderStatusToUse = [
		{ idStatusOrder: 1, statusOrder: 'Recibido' },
		{ idStatusOrder: 2, statusOrder: 'Cerrada' },
		{ idStatusOrder: 3, statusOrder: 'Listo' },
		{ idStatusOrder: 4, statusOrder: 'Cancelado' },
	];

	// Filters
	const [filterForm] = Form.useForm();

	const onReset = () => {
		let dateStart = new Date(2023, 0, 1);
		let dateEnd = new Date();
		getOrdersRequest({
			idBranchFk: `${environmentList[0].idBranchFk}`,
			dateStart,
			dateEnd,
		});
		setQuery({
			idStatusOrder: 0,
			startDate: null,
			endDate: null,
		});
		filterForm.resetFields();
	};

	const handleSearch = async (values) => {
		console.log('values', values);
		console.log('Dates', values.date[0].$d, values.date[0].$d);
		setQuery({
			idStatusOrder: values.idStatusOrder || 0,
			startDate: values.date ? values.date[0]?.$d : null,
			endDate: values.date ? values.date[1]?.$d : null,
		});

		if (values.date) {
			console.log(environmentList, 'Env list');
			await getOrdersRequest({
				idBranchFk: `${environmentList[0].idBranchFk}`,
				dateStart: values.date[0].$d,
				dateEnd: values.date[1].$d,
			});
		}
	};

	const ordersList = useMemo(() => {
		let list = orders;
		if (query.idStatusOrder) {
			list = list.filter((o) => o.idStatusOrder === query.idStatusOrder);
		}
		addKeys(list);
		return list;
	}, [query, orders]);

	useEffect(() => {
		// console.log('OrderList', ordersList);
		// console.log('query', query);
	}, [ordersList, query]);

	// End Filters

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Row style={{ alignItems: 'center' }}>
					<Col offset={6} span={12}>
						<h1
							style={{
								textAlign: 'center',
								fontSize: '2rem',
								color: '#fff',
							}}
						>
							Pedidos
						</h1>
					</Col>
					<Col
						span={6}
						style={{
							justifyContent: 'center',
							display: 'flex',
						}}
					>
						<Button type="primary">
							<Link href="orders/add">Agregar</Link>
						</Button>
					</Col>
				</Row>
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Form
							form={filterForm}
							onFinish={handleSearch}
							style={{ maxWidth: '900px' }}
							labelCol={{ span: 8 }}
						>
							<Row
								style={{
									justifyContent: 'space-between',
								}}
							>
								<Col span={12}>
									<Form.Item
										label="Estado"
										name="idStatusOrder"
										style={{
											padding: '0 .5rem',
										}}
									>
										<Select>
											{orderStatusToUse.map((o) => (
												<Select.Option
													key={o.idStatusOrder}
													value={o.idStatusOrder}
												>
													{o.statusOrder}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Fecha"
										name="date"
										style={{
											padding: '0 .5rem',
										}}
									>
										<DatePicker.RangePicker />
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col span={12}>
									<Form.Item
										wrapperCol={{ offset: 8, span: 12 }}
									>
										<Button
											htmlType="submit"
											block
											onClick={onReset}
										>
											Limpiar
										</Button>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										wrapperCol={{ offset: 8, span: 12 }}
									>
										<Button
											htmlType="submit"
											type="primary"
											block
										>
											Buscar
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Collapse.Panel>
				</Collapse>
				<Table
					columns={columns}
					dataSource={ordersList}
					loading={loading}
				/>
			</div>
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleSeeModal}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
