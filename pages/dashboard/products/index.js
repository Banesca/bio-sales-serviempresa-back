import { useEffect, useState } from 'react';

import {
	Col,
	Input,
	Row,
	Table,
	Space,
	Button,
	Select,
	Collapse,
	Form,
	Modal,
} from 'antd';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EyeTwoTone,
} from '@ant-design/icons';

import DashboardLayout from '../../../components/layout';
import { data } from '../../../components/products/util/data';
import { getProducts } from '../../../services/products';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Products() {
	const router = useRouter();
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
			title: 'Empresa',
			dataIndex: 'business',
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
			render: (product, index) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => {
							router.push(`/dashboard/products/${product.id}`);
						}}
					>
						<EyeTwoTone />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(product)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];
	// loading
	const [loading, setLoading] = useState(true);

	// Data
	const [products, setProducts] = useState([]);

	useEffect(() => {
		// request data
		// setProducts(getProducts())
		// end request data
		setProducts(data);
		setLoading(false);
	}, []);

	// Delete Modal
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);

	// which modal component
	const [currentProduct, setCurrentProduct] = useState();

	const handleOpenDeleteModal = (product) => {
		setCurrentProduct(product);
		setDeleteModalOpen(true);
	};

	const handleDelete = () => {
		// request delete product
		console.log(currentProduct.id);
		setDeleteModalOpen(false);
	};

	const onSubmit = (values) => {
		setLoading(true);
		for (const v of Object.keys(values)) {
			if (!values[v]) {
				delete values[v];
			}
		}
		const products = getProducts(values);
		//setProducts(products);
		setLoading(false);
	};

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
					<Col span={18}>
						<h1 style={{ fontSize: '2rem', color: '#fff' }}>
							Productos
						</h1>
					</Col>
					<Col span={6}>
						<Button>
							<Link href="products/import">Importar</Link>
						</Button>
					</Col>
				</Row>
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Row style={{ justifyContent: 'center' }}>
							<Form
								style={{ maxWidth: '900px' }}
								name="productFilters"
								onFinish={onSubmit}
								labelCol={{ span: 10 }}
							>
								<Row>
									<Col span={12}>
										<Form.Item
											label="Nombre"
											style={{ padding: '0 .5rem' }}
											name="name"
										>
											<Input allowClear />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Código"
											name="code"
											style={{ padding: '0 .5rem' }}
										>
											<Input allowClear />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											label="Precio mínimo"
											name="minPrice"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Input type="number" allowClear />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Precio máximo"
											name="maxPrice"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Input type="number" allowClear />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											label="Categoría"
											name="category"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select allowClear>
												<Select.Option value="hello">
													Hello
												</Select.Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Marca"
											name="brand"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select allowClear></Select>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											label="Proveedor"
											name="provider"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select allowClear></Select>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Empresa"
											name="business"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select allowClear></Select>
										</Form.Item>
									</Col>
								</Row>
								<Form.Item wrapperCol={{ span: 6, offset: 9 }}>
									<Button
										htmlType="submit"
										type="primary"
										block
									>
										Buscar
									</Button>
								</Form.Item>
							</Form>
						</Row>
					</Collapse.Panel>
				</Collapse>
				<Table
					columns={columns}
					dataSource={products}
					loading={loading}
				/>
			</div>
			<Modal
				title="Eliminar"
				open={deleteModalOpen}
				onCancel={() => setDeleteModalOpen(false)}
				onOk={handleDelete}
				okText="Eliminar"
				cancelText="Cancelar"
			>
				<p>Estas seguro de que deseas eliminar este producto</p>
			</Modal>
		</DashboardLayout>
	);
}
