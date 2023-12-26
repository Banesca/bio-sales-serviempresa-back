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
	Input,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { useRequest } from '../../../hooks/useRequest';
import { ip } from '/util/environment.js';
import { NodeIndexOutlined } from '@ant-design/icons';

const Rutas = () => {
	const { requestHandler } = useRequest();
	const [users, setUsers] = useState([]);
	const [reportProduct, setReportProduct] = useState([]);
	const { filtered } = useProductFilter();
	const [open2, setOpen2] = useState(false);
	const [productsDetail, setProductsDetail] = useState([]);
	const [detailsRutas, setDetailsRutas] = useState([]);

	const columns = [
		{
			title: 'Chofer',
			dataIndex: 'idChoferFk',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Fecha de creacion',
			dataIndex: 'created_at',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Id de la orden',
			dataIndex: 'idOrdersbypassing',
			key: 3,
			render: (text) => <p>{text}</p>,
		},

		{
			title: 'Accion',
			dataIndex: 'idReportVisit',
			key: '6',
			render: (index, record) => (
				<Button onClick={() => showModal2(record)}>
					<NodeIndexOutlined />
				</Button>
			),
		},
	];
	const columns2 = [
		{
			title: 'Productos',
			dataIndex: 'nameProduct',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cantidad',
			dataIndex: 'quantityProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Peso unitario',
			dataIndex: 'weight',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Total',
			dataIndex: 'idOrdersbypassing',
			key: 3,
			render: (text) => <p>{text}</p>,
		}
	];

	useEffect(() => {
		getUsers();
	}, []);

	const showModal2 = (productos) => {
		setOpen2(true);
		setProductsDetail(productos);
		handleOnChang(productos);
	};

	const handleOnChang = async (productos) => {
		const res = await requestHandler.get(
			`/api/v2/ordersbypassingh/list/${productos.idOrdersbypassing}`
		);
		if (res.value && res.value._value && res.value._value.data) {
			const products = res.value._value.data.map(item => item.ordenes[0].products).flat();
			setDetailsRutas(products);
		} else {
			console.log('res.value._value.data is undefined');
		}
	};

	const getUsers = async () => {
		const res = await requestHandler.get('/api/v2/user/only/enable');
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data.filter((b) => b.idProfileFk == 3);
			setUsers(value);
		}
		console.log(res);
	};

	const handleOnChange = async (value) => {
		const res = await requestHandler.get(
			`/api/v2/ordersbypassingh/list/byuser/${value}`
		);
		console.log(res);
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response;
			setReportProduct(value);
		}
	};
	console.log(productsDetail);
	const handleCancel = () => {
		setOpen2(false);
	};

	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Rutas del despachador'}></Title>
				<Row>
					<Col span={12}>
						<Form.Item
							label="Despachador"
							rules={[
								{
									required: true,
									message: 'Elige un despachador',
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
						<Table columns={columns} dataSource={reportProduct} />
					</ConfigProvider>
				</div>
			</div>

			<Modal
				open={open2}
				onCancel={handleCancel}
				width={1000}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-1">
						<Button danger key="cancel" onClick={handleCancel}>
							Cancelar
						</Button>
					</div>,
				]}
			>
				<Title title={'Consolidado de ruta'}></Title>
				<div>
					<p>Chofer: {productsDetail.idChoferFk}</p>
					<p>Id de la ruta: {productsDetail.idReportVisit}</p>
					<p>Peso total</p>
					<Table columns={columns2} dataSource={detailsRutas} />
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default Rutas;
