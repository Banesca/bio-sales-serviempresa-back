import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { Card, ConfigProvider, Row, Space, Table, Col, Form, Select } from 'antd';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import Image from 'next/image';
import { useRequest } from '../../../hooks/useRequest';

const Merchandising = () => {
	const { requestHandler } = useRequest();
	const [users, setUsers] = useState([]);
	const [message, setMessage] = useState('');
	const [reportVisit, setReportVisit] = useState('');
	const { filtered } = useProductFilter();
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
					{/* <Button
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
			render: (text) => <p># - {text}</p>,
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
	];
	const columns3 = [
		{
			title: 'Producto',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Codigo',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'nameProduct',
			key: 1,
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
					{/* <Button
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

	useEffect(() => {
		getUsers();

	}, []);



	const getUsers = async () => {
		const res = await requestHandler.get('/api/v2/user/only/enable');
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data.filter((b) => b.idProfileFk == 5
			);
			setUsers(value);
		}
	};

	const listReportVisist = async () => {
	
	}


	const handleOnChange = async value => {
		const res = await requestHandler.get(`/api/v2/reportvisit/list/${value}/5`);
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.response
			setReportVisit(value);
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
						<Table columns={columns2}  dataSource={reportVisit}/>
					</ConfigProvider>
					<h1 className="text-center text-4xl font-semibold">
						Reporte
					</h1>
					<Card className="shadow-lg rounded-xl gap-5">
						<h2 className="text-center text-3xl my-2">Evidencia fotográfica</h2>
						<div className="flex gap-5 justify-center items-center">
							<div className="flex flex-col gap-2">
								<h2>Antes:</h2>
								<div className="h-80 w-96 relative mb-5">
									<Image
										alt="Sin datos"
										src={''}
										fill
										className="object-cover bg-gray-200"
									/>
								</div>
								<div>
									<h1>Descripción:</h1>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<h2>Después:</h2>
								<div className="h-80 w-96 relative mb-5">
									<Image
										alt="Sin datos"
										src={''}
										fill
										className="object-cover bg-gray-200"
									/>
								</div>
								<div>
									<h1>Descripción:</h1>
								</div>
							</div>
						</div>
					</Card>
					<div className="w-full h-full">
						<h1 className="text-3xl text-center my-4">
							Estados de los productos
						</h1>
						<ConfigProvider
							renderEmpty={
								filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
							}
						>
							<Table columns={columns3} />
						</ConfigProvider>
					</div>
					<div className="w-full">
						<h1 className="text-3xl text-center my-4">Productos sugeridos</h1>
						<ConfigProvider
							renderEmpty={
								filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
							}
						>
							<Table columns={columns} />
						</ConfigProvider>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Merchandising;
