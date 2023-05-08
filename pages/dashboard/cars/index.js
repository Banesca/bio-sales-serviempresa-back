import React, { useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import {
	Button,
	Card,
	ConfigProvider,
	Form,
	Input,
	Modal,
	Space,
	Table,
} from 'antd';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import { PlusOutlined } from '@ant-design/icons';

const Cars = () => {
	const { filtered } = useProductFilter();
	const [openModal, setOpenModal] = useState(false);
	const [openModal2, setOpenModal2] = useState(false);
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'CI',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Licencia',
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
			title: 'Placa',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Modelo',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Despachador',
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

	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Camiones'}>
					<Button className="bg-white" onClick={() => setOpenModal(true)}>
						<PlusOutlined />
						Agregar un chofer
					</Button>
				</Title>
				<div className="flex flex-col gap-10">
					<ConfigProvider
						renderEmpty={
							filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
						}
					>
						<Table columns={columns} />
					</ConfigProvider>
					<div>
						<Title>
							<Button className="bg-white" onClick={() => setOpenModal2(true)}>
								<PlusOutlined />
								Agregar un camión
							</Button>
						</Title>
						<ConfigProvider
							renderEmpty={
								filtered().length !== 0 || true ? CustomizeRenderEmpty : ''
							}
						>
							<Table columns={columns2} />
						</ConfigProvider>
					</div>
				</div>
			</div>
			<Modal open={openModal} onCancel={() => setOpenModal(false)}>
				<h1>Crea una condicion de pago</h1>
				<Form>
					<Form.Item label="Condicion">
						<Input></Input>
					</Form.Item>
					<Form.Item label="Cliente">
						<Input></Input>
					</Form.Item>
				</Form>
			</Modal>
			<Modal open={openModal2} onCancel={() => setOpenModal2(false)}>
				<h1>Crea una condicion de pago</h1>
				<Form>
					<Form.Item label="Placa">
						<Input></Input>
					</Form.Item>
					<Form.Item label="Modelo">
						<Input></Input>
					</Form.Item>
					<Form.Item label="Despachador">
						<Input></Input>
					</Form.Item>
				</Form>
			</Modal>
		</DashboardLayout>
	);
};

export default Cars;
