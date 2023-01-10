import { useContext, useEffect, useState } from 'react';

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
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { addKeys } from '../../../util/setKeys';
import SelectBusiness from '../../../components/business/selectBusiness';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/loading';

export default function Products() {
	const router = useRouter();
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'barCode',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 3,
			render: (text, record) => (
				<p>{record.isOnPromotion ? record.promotionPrice : text}$</p>
			),
		},
		{
			title: 'Empresa',
			key: 5,
			render: (text) => (
				<p>{JSON.parse(localStorage.getItem('business'))[0].nombre}</p>
			),
		},
		{
			title: 'Promoción',
			dataIndex: 'isPromo',
			key: 5,
			render: (text) => {
				return (
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{text != 0 ? (
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
							router.push(
								`/dashboard/products/${product.idProduct}`
							);
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

	const generalContext = useContext(GeneralContext);

	// Data
	const [totalProducts, setTotalProducts] = useState([]);
	const [products, setProducts] = useState([]);

	const [categories, setCategories] = useState([]);

	const { requestHandler } = useRequest();

	const handleListProductRequest = async (
		pFamily = 0,
		pSubFamily = 0,
		business = 1
	) => {
		const response = await requestHandler.get(
			`/api/v2/product/list/lite/${pFamily}/${pSubFamily}/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().data;
		addKeys(value);
		setTotalProducts(value);
		setProducts(value);
	};

	const categoryListRequest = async (business = 1) => {
		const response = await requestHandler.get(`/api/v2/family/list/1`);
		if (response.isLeft()) {
			return;
		}
		console.log(response.value.getValue());
		const value = response.value.getValue().response;
		setCategories(value);
	};

	const businessContext = useBusinessProvider();

	useEffect(() => {
		// request data
		setLoading(true);
		if (generalContext) {
			const business = businessContext.selectedBusiness;
			console.log(business);
			handleListProductRequest(0, 0, business?.idSucursal || 1);
			categoryListRequest(business?.idSucursal || 1);
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, businessContext.selectedBusiness]);

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
		console.log(values);
		let productsToFilter = totalProducts;
		if (values.nameProduct) {
			console.log('filter name');
			productsToFilter = productsToFilter.filter((p) =>
				p.nameProduct.includes(values.nameProduct)
			);
		}
		if (values.barCode) {
			console.log('filter code');
			productsToFilter = productsToFilter.filter((p) => {
				if (!p.barCode) {
					return;
				}
				return p.barCode.includes(values.barCode);
			});
		}
		if (values.minPrice) {
			console.log('filter min');
			productsToFilter = productsToFilter.filter(
				(p) => p.priceSale > Number(values.minPrice)
			);
		}
		if (values.maxPrice) {
			console.log('filter max');
			productsToFilter = productsToFilter.filter(
				(p) => p.priceSale < Number(values.maxPrice)
			);
		}
		if (values.nameSubFamily) {
			console.log('filter category');
			productsToFilter = productsToFilter.filter(
				(p) => p.nameSubFamily === values.nameSubFamily
			);
		}
		console.log(productsToFilter);
		console.log('submit');
		setProducts(productsToFilter);
		setLoading(false);
	};

	const [form] = Form.useForm();

	const onReset = () => {
		setProducts(totalProducts);
		form.resetFields();
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
					<Col offset={6} span={12}>
						<h1
							style={{
								textAlign: 'center',
								fontSize: '2rem',
								color: '#fff',
							}}
						>
							Productos
						</h1>
					</Col>
					<Col
						span={6}
						style={{
							justifyContent: 'center',
							display: 'flex',
						}}
					>
						<Button style={{ marginRight: '1rem' }}>
							<Link href="products/import">Importar</Link>
						</Button>
						<Button>
							<Link href="products/add">Agregar</Link>
						</Button>
					</Col>
				</Row>
				<SelectBusiness />
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Row style={{ justifyContent: 'center' }}>
							<Form
								form={form}
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
											name="nameProduct"
										>
											<Input allowClear />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Código"
											name="barCode"
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
											name="nameSubFamily"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select allowClear>
												{categories &&
													categories.map((c, i) => (
														<Select.Option
															key={
																c.idProductFamily
															}
															value={c.name}
														>
															{c.name}
														</Select.Option>
													))}
											</Select>
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											wrapperCol={{
												span: 12,
												offset: 12,
											}}
										>
											<Button
												type="primary"
												block
												onClick={onReset}
											>
												Limpiar
											</Button>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											wrapperCol={{ span: 12, offset: 0 }}
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
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
