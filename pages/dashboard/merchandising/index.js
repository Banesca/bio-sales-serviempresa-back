import {
	Button,
	Card,
	Col,
	ConfigProvider,
	Form,
	Modal,
	Row,
	Select,
	Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { useRequest } from '../../../hooks/useRequest';
import { ip } from '/util/environment.js';
import { FileImageOutlined } from '@ant-design/icons';

const Merchandising = () => {
	const { requestHandler } = useRequest();
	const [users, setUsers] = useState([]);
	const [userSelected, setUserSelected] = useState([]);
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [message, setMessage] = useState('');
	const [clients, setClients] = useState('');
	const [reportVisit, setReportVisit] = useState([]);
	const [reportProduct, setReportProduct] = useState([]);
	const [reportInventario, setReportInventario] = useState([]);
	const [suggestedProductsList, setSuggestedProductsList] = useState('');
	const [reportVisitDetail, setReportVisitDetail] = useState([]);
	const [productsDetail, setProductsDetail] = useState([]);
	const { filtered } = useProductFilter();
	const [modalText, setModalText] = useState();

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Descripcion',
			dataIndex: 'description',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'fecha',
			dataIndex: 'fecha',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Ver lista',
			dataIndex: 'idUtilsH',
			key: '4',
			render: (record) => (
				<Button onClick={() => showModal2(record)}>
					<FileImageOutlined />
				</Button>
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
				<Button onClick={() => showModal(record)}>
					<FileImageOutlined />
				</Button>
			),
		},
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
			title: 'Usuario',
			dataIndex: 'fullname',
			key: 5,
			render: (text) => <p>{text}</p>,
		},
	];

	const columns4 = [
		{
			title: 'Imagen',
			dataIndex: 'urlImagenProduct',
			key: 1,
			
		},
		{
			title: 'Nombre del producto',
			dataIndex: 'nameProduct',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title:'Codigo de barra',
			dataIndex: 'barCode',
			key: 3,
			render: (text) => <p>{text}</p>,
		}
		
	];

	const showModal = (reporte) => {
		setOpen(true);
		setReportVisitDetail(reporte);
	};
	const showModal2 = (productos) => {
		console.log(productos)
		setOpen2(true);
		setProductsDetail(productos);
		handleOnChang3(productos); 
	};

	useEffect(() => {
		getUsers();
		getClients();
	}, []);

	const getUsers = async () => {
		const res = await requestHandler.get('/api/v2/user/only/enable');
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data.filter((b) => b.idProfileFk == 5);
			setUsers(value);
		}
	};

	const handleOnChange = async (value) => {
		let id = value;
		const res = await requestHandler.get(
			`/api/v2/reportvisit/list/${value}/10`
		);
		console.log(res)
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response;
			setReportVisit(value);
			let merchandise = users.filter((b) => b.idUser == id);
			setUserSelected(merchandise[0]);
		}
	};


	const handleOnChang2  = async (value) => {
		let id = value;
		const res = await requestHandler.get(
			`/api/v2/utilh/list/byuser/${value}`
		);
		console.log(res);
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response;
			setReportProduct(value);
			let merchandise = users.filter((b) => b.idUser == id);
			setUserSelected(merchandise[0]);
		}
	};

	const handleOnChang3  = async (value) => {
		
		const res = await requestHandler.get(
			`/api/v2/utilb/list/${value}`
		);
		console.log(res);
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response;
			setReportInventario(value);
		}
	};


	const getSuggestedProducts = async (idClient) => {
		const response = await requestHandler.get(
			`/api/v2/productclient/list/${idClient}`
		);
		if (!response.isLeft()) {
			setSuggestedProductsList(response.value.getValue().response);
		}
	};

	const handleCancel = () => {
		setOpen(false);
	};
	const handleCancel2 = () => {
		setOpen2(false);
	};

	const getClients = async () => {
		const res = await requestHandler.get('/api/v2/client/list');
		if (!res.isLeft()) {
			let clientsList = res.value.getValue().response;
			clientsList = clientsList.filter((b) => b.idStatusFk !== '3');
			setClients(clientsList);
		}
	};

	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Reporte de visita merchandiser'}></Title>
				<Row>
					<Col span={12}>
						<Form.Item
							label="Merchandiser"
							rules={[
								{
									required: true,
									message: 'Elige un merchandiser',
								},
							]}
							name="selectClient"
						>
							<Select onSelect={(value, event) => handleOnChange(value, event)}>
								{users &&
									users.map((c) => (
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
						Productos sugeridos por merchandiser
					</h1>
					<div className="w-full">
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
									<Select
										onSelect={(value, event) =>
											getSuggestedProducts(value, event)
										}
									>
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

			<div className="m-4 p-4">
				<Title title={'Inventario merchandiser'}></Title>
				<Row>
					<Col span={12}>
						<Form.Item
							label="Merchandiser"
							rules={[
								{
									required: true,
									message: 'Elige un merchandiser',
								},
							]}
							name="selectClient"
						>
							<Select onSelect={(value, event) => handleOnChang2(value, event)}>
								{users &&
									users.map((c) => (
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
						<Table columns={columns} dataSource={reportProduct} />
					</ConfigProvider>
				
				</div>

				
			</div>
			<Modal
				title={`Detalle de reporte: N#-${reportVisitDetail.idReportVisit} / Usuario: ${userSelected.fullname}`}
				open={open}
				onCancel={handleCancel}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-1">
						<Button danger key="cancel" onClick={handleCancel}>
							Cancelar
						</Button>
					</div>,
				]}
			>
				<Card>
					<Card.Grid style={{ width: '50%', textAlign: 'center' }}>
						<img
							alt="example"
							src={`${ip}:8078/visit/${reportVisitDetail.image}`}
						/>
					</Card.Grid>
					<Card.Grid style={{ width: '50%', textAlign: 'center' }}>
						<img
							alt="example"
							src={`${ip}:8078/visit/${reportVisitDetail.image2}`}
						/>
					</Card.Grid>
				</Card>
			</Modal>
			<Modal
				open={open2}
				onCancel={handleCancel2}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-1">
						<Button danger key="cancel" onClick={handleCancel2}>
							Cancelar
						</Button>
					</div>,
				]}
			>
				
				<Table columns={columns4}  dataSource={reportInventario}  />
			</Modal>
		</DashboardLayout>
	);
};

export default Merchandising;
