import { Button, Card, Col, ConfigProvider, Form, Modal, Row, Select, Space, Table, Meta } from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { useRequest } from '../../../hooks/useRequest';
import { ip } from "/util/environment.js";


const Merchandising = () => {
	const { requestHandler } = useRequest();
	const [users, setUsers] = useState([]);
	const [userSelected, setUserSelected] = useState([]);
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [clients, setClients] = useState('');
	const [reportVisit, setReportVisit] = useState([]);
	const [suggestedProductsList, setSuggestedProductsList] = useState('');
	const [reportVisitDetail, setReportVisitDetail] = useState([]);
	const { filtered } = useProductFilter();
	const [modalText, setModalText] = useState();

	const columns = [
		{
			title: 'Producto',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					{ /*<Button
						type="primary"
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/${product.idProduct}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					
					<Button
						onClick={() => {
							setLoading(true);
							router.push(`/dashboard/products/update/${product.idProduct}`);
						}}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button> */}
				</Space>
			),
		},
	];
	const columns2 = [
		{
			title: 'Nro. de reporte',
			dataIndex: 'idReportVisit',
			key: 1,
			render: (text) => <p>N# {text}</p>,
		},
		{
			title: 'Tipo de reporte',
			dataIndex: 'type',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cliente',
			dataIndex: 'nameClient',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Fecha',
			dataIndex: 'created_at',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Nota',
			dataIndex: 'note',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Evidencia',
			dataIndex: 'idReportVisit',
			key: '6',
			render: (index, record) => (
				<Button type="primary" onClick={() => showModal(record)}>
					Edit
				</Button>
			),
		}
	];
	const columns3 = [
		{
			title: 'Código',
			dataIndex: 'barCode',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Producto',
			dataIndex: 'nameProduct',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Fecha',
			dataIndex: 'created_at',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'statusName',
			key: 5,
			render: (text) => <p>{text}</p>,
		}
	];


	const showModal = (reporte) => {
		setOpen(true);
		setReportVisitDetail(reporte)
	}

	useEffect(() => {
		getUsers();
		getClients();
	}, []);

	useEffect(() => {
	}, [clients, users]);



	const getUsers = async () => {
		const res = await requestHandler.get('/api/v2/user/only/enable');
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data.filter((b) => b.idProfileFk == 5
			);
			setUsers(value);
		}
	};


	const handleOnChange = async value => {
		let id = value
		const res = await requestHandler.get(`/api/v2/reportvisit/list/${value}/10`);
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response
			setReportVisit(value);
			let merchandise = users.filter((b) => b.idUser == id);
			setUserSelected(merchandise[0])
			
		}
	}


	const getSuggestedProducts = async idClient => {
		const response = await requestHandler.get(`/api/v2/productclient/list/${idClient}`);
		if (!response.isLeft()) {
			setSuggestedProductsList(response.value.getValue().response);

		}	
	};

	const handleCancel = () => {
		setOpen(false);
	};


	const getClients = async () => {
		const res = await requestHandler.get('/api/v2/client/list');
		if (!res.isLeft()) {
			let clientsList = res.value.getValue().response;
			///	clientsList = clientsList.filter((b) => b.idStatusFk !== '3');
			setClients(clientsList);
		}
	}


	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Reporte de merchandise'}></Title>
				<Row>
					<Col span={12}>
						<Form.Item
							label="Merchandise"
							rules={[
								{
									required: true,
									message: 'Elige un merchandise',
								},
							]}
							name="selectClient"
						>
							<Select onSelect={(value, event) => handleOnChange(value, event)}>
								{users &&
									users.map((c, i) => (
										<Select.Option value={c.idUser} key={c.idUser}>
											{c.fullname}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<div className="flex flex-col gap-5">
					<ConfigProvider
						renderEmpty={
							filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
						}
					>
						<Table columns={columns2} dataSource={reportVisit} />
					</ConfigProvider>
					<h1 className="text-center text-4xl font-semibold">
						Reporte
					</h1>
					<div className="w-full">
						<h1 className="text-3xl text-center my-4">Productos sugeridos</h1>
						<Row>
							<Col span={12}>
								<Form.Item
									label="Cliente"
									rules={[
										{
											required: true,
											message: 'Elige un cliente',
										},
									]}
									name="selectClient"
								>
									<Select onSelect={(value, event) => getSuggestedProducts(value, event)}>
										{clients &&
											clients.map((c, i) => (
												<Select.Option value={c.idClient} key={c.idClient}>
													{c.nameClient}
												</Select.Option>
											))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<ConfigProvider
							renderEmpty={
								filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
							}
						>
							<Table columns={columns3} dataSource={suggestedProductsList} />
						</ConfigProvider>
					</div>
				</div>
			</div>
			<Modal
				title={`Detalle de reporte: N#-${reportVisitDetail.idReportVisit} / DE: ${userSelected.fullname}`}
				open={open}
				onCancel={handleCancel} 
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-1">
						<Button danger key="cancel" onClick={handleCancel}>
							Cancelar
						</Button>
					</div>
				]}
			>
				<Card>
					<Card.Grid style={{ width: '50%', textAlign: 'center' }}>
						<img alt="example" src={`${ip}:8078/visit/${reportVisitDetail.image}`} />
					</Card.Grid>
					<Card.Grid style={{ width: '50%', textAlign: 'center' }}>
						<img alt="example" src={`${ip}:8078/visit/${reportVisitDetail.image}`} />
					</Card.Grid>
				</Card>
			</Modal>

		</DashboardLayout >

	);
};

export default Merchandising;
