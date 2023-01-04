import { useEffect, useState } from 'react';
import { Col, Input, Row, Table, Space, Button, Select, Collapse } from 'antd';
import { Form } from 'antd';
import { Modal } from 'antd';
import { Divider } from 'antd';

import DashboardLayout from '../../../components/layout';
import DetailProductModal from '../../../components/products/detailProductModal';
import EditProductModal from '../../../components/products/editProductModal';
import { columns } from '../../../components/products/util/tableColumns';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeTwoTone,
} from '@ant-design/icons';

const data = [
	{
		key: 1,
		name: 'Keyboard Kumara',
		code: '23415125415',
		price: 14.99,
		category: 'Tech',
		business: 'Innova',
		brand: 'Redragon',
		provider: 'Redragon',
		isOnPromotion: true,
		promotionPrice: 11.99,
		stock: 15,
	},
	{
		key: 2,
		name: 'Mouse',
		code: '23415125415',
		price: 14.99,
		category: 'Tech',
		brand: 'Redragon',
		business: 'Innova',
		provider: 'Redragon',
		isOnPromotion: false,
		promotionPrice: 11.99,
		stock: 10,
	},
];

export default function Products() {
	// loading
	const [loading, setLoading] = useState(true);

	// Data
	const [products, setProducts] = useState([]);

	useEffect(() => {
		// request data
		setProducts(data);
		setLoading(false);
	}, []);

	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// which modal component
	const [isDetailModal, setIsDetailModal] = useState();
	const [currentProduct, setCurrentProduct] = useState();

	const handleCloseModal = (data) => {
		setIsModalOpen(false);
	};

	const handleOpenModal = ({ detail, product }) => {
		if (detail) {
			setIsDetailModal(true);
		} else {
			setIsDetailModal(false);
		}
		setCurrentProduct(product);
		setIsModalOpen(true);
	};

	const handleDelete = () => {
	};

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'code',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'price',
			key: 3,
			render: (text, record) => (
				<p>{record.isOnPromotion ? record.promotionPrice : text}$</p>
			),
		},
		{
			title: 'Categoría',
			dataIndex: 'category',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Empresa',
			dataIndex: 'business',
			key: 5,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Proveedor',
			dataIndex: 'provider',
			key: 5,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Promoción',
			dataIndex: 'isOnPromotion',
			key: 5,
			render: (bool) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{bool ? (
							<CheckCircleOutlined
								style={{ fontSize: '1.5rem', color: 'green' }}
							/>
						) : (
							<CloseCircleOutlined
								style={{ fontSize: '1.5rem', color: 'red' }}
							/>
						)}
					</div>
				);
			},
		},

		{
			title: 'Acciones',
			key: 6,
			render: (_, index) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() =>
							handleOpenModal({ detail: true, product: _ })
						}
					>
						<EyeTwoTone />
					</Button>
					<Button
						type="primary"
						onClick={() =>
							handleOpenModal({ detail: false, product: _ })
						}
					>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => setDeleteModalOpen(true)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<h1 style={{ fontSize: '2rem' }}>Productos</h1>
				<Collapse style={{ width: '100%' }}>
					<Collapse.Panel header="Filtros">
						<Row style={{ justifyContent: 'center' }}>
							<Form style={{ maxWidth: '900px' }}>
								<Row>
									<Col span={24}>
										<Form.Item
											label="Nombre o Código"
											style={{ padding: '0 .5rem' }}
										>
											<Input.Search
												allowClear
												placeholder="nombre o código"
											/>
										</Form.Item>
									</Col>
								</Row>
								<Divider />
								<Row>
									<Col span={12}>
										<Form.Item
											label="Precio mínimo"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Input
												type="number"
												placeholder="Precio mínimo"
												allowClear
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Precio máximo"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Input
												type="number"
												placeholder="Precio máximo"
												allowClear
											/>
										</Form.Item>
									</Col>
								</Row>
								<Row
									style={{
										justifyContent: 'space-between',
									}}
								>
									<Col span={8}>
										<Form.Item
											label="Categoría"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select
												allowClear
												placeholder="Categoría"
											>
												<Select.Option value="hello">
													Hello
												</Select.Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											label="Marca"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select
												allowClear
												placeholder="Marca"
											></Select>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											label="Proveedor"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select
												allowClear
												placeholder="Proveedor"
											></Select>
										</Form.Item>
									</Col>
								</Row>
								<Form.Item>
									<Button htmlType="submit" type="primary">
										Buscar
									</Button>
								</Form.Item>
							</Form>
						</Row>
					</Collapse.Panel>
				</Collapse>
			</div>
			<Table columns={columns} dataSource={products} loading={loading} />
			<Modal
				open={isModalOpen}
				onCancel={() => handleCloseModal({ accept: false })}
				onOk={() => handleCloseModal({ accept: true })}
				okText={setIsDetailModal ? 'Aceptar' : 'Editar'}
				cancelText={setIsDetailModal ? false : 'Cancelar'}
			>
				{isDetailModal ? (
					<DetailProductModal product={currentProduct} />
				) : (
					<EditProductModal />
				)}
			</Modal>
			<Modal
				title="Eliminar"
				open={deleteModalOpen}
				onCancel={() => setDeleteModalOpen(false)}
				onOk={() => handleDelete()}
				okText="Eliminar"
				cancelText="Cancelar"
			>
				<p>Estas seguro de que deseas eliminar este producto</p>
			</Modal>
		</DashboardLayout>
	);
}
