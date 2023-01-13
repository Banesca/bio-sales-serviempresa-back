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
	EditOutlined,
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
import { message } from 'antd';

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
				<p>${record.isOnPromotion ? record.promotionPrice : text}</p>
			),
		},
		{
			title: 'Empresa',
			key: 5,
			render: (text) => (
				<p>
					{
						JSON.parse(localStorage.getItem('selectedBusiness'))
							.nombre
					}
				</p>
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
						onClick={() => {
							router.push(
								`/dashboard/products/update/${product.idProduct}`
							);
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
	const [brands, setBrands] = useState([]);

	const { requestHandler } = useRequest();

	const handleListProductRequest = async (
		pFamily = 0,
		pSubFamily = 0,
		business = 1
	) => {
		const response = await requestHandler.get(
			`/api/v2/product/list/${pFamily}/${pSubFamily}/${business}`
		);
		if (response.isLeft()) {
			setLoading(false);
			return;
		}
		const value = response.value.getValue().data;
		addKeys(value);
		setTotalProducts(value);
		setProducts(value);
		setLoading(false);
	};

	const categoryListRequest = async (business = 1) => {
		const response = await requestHandler.get(
			`/api/v2/family/list/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		const value = response.value.getValue().response;
		setCategories(value);
	};

	const brandListRequest = async (business = 1) => {
		const response = await requestHandler.get(
			`/api/v2/subfamily/list/${business}`
		);
		if (response.isLeft()) {
			return;
		}
		console.log('BRAND', response.value.getValue());
		const value = response.value.getValue().response;
		setBrands(value);
	};

	const deleteProductRequest = async (id) => {
		setLoading(true);
		const res = await requestHandler.delete(`/api/v2/product/delete/${id}`);
		if (res.isLeft()) {
			console.log(res.value.getErrorValue());
			message.error('Ha ocurrido un error');
			setLoading(false);
			return;
		}
		const value = res.value.getValue().response;
		console.log(value);
		handleListProductRequest(0, 0, selectedBusiness.idSucursal);
		message.success('Product Eliminado');
	};

	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		// request data
		setProducts([]);
		setLoading(true);
		if (generalContext && selectedBusiness) {
			console.log('products');
			categoryListRequest(selectedBusiness.idSucursal);
			brandListRequest(selectedBusiness.idSucursal);
			handleListProductRequest(0, 0, selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

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
		console.log(currentProduct.idProduct);
		deleteProductRequest(currentProduct.idProduct);
		setDeleteModalOpen(false);
	};

	const onSubmit = (values) => {
		setLoading(true);
		for (const v of Object.keys(values)) {
			if (!values[v]) {
				delete values[v];
			}
		}
		console.log('VALUES', values);
		let productsToFilter = totalProducts;
		if (values.nameProduct) {
			productsToFilter = productsToFilter.filter((p) =>
				p.nameProduct
					.toLowerCase()
					.includes(values.nameProduct.toLowerCase())
			);
		}
		if (values.barCode) {
			productsToFilter = productsToFilter.filter((p) => {
				if (!p.barCode) {
					return;
				}
				return p.barCode.includes(values.barCode);
			});
		}
		if (values.minPrice) {
			productsToFilter = productsToFilter.filter(
				(p) => p.priceSale > Number(values.minPrice)
			);
		}
		if (values.maxPrice) {
			productsToFilter = productsToFilter.filter(
				(p) => p.priceSale < Number(values.maxPrice)
			);
		}
		if (values.nameFamily) {
			console.log('filter category');
			productsToFilter = productsToFilter.filter(
				(p) => p.idProductFamily === values.nameFamily
			);
		}
		if (values.nameSubFamily) {
			console.log('filter brand');
			console.log(values.nameFamily);
			productsToFilter = productsToFilter.filter(
				(p) => p.idProductSubFamily === values.nameSubFamily
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
											name="nameFamily"
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
															value={
																c.idProductFamily
															}
														>
															{c.name}
														</Select.Option>
													))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											label="Marca"
											name="nameSubFamily"
											style={{
												padding: '0 .5rem',
											}}
										>
											<Select allowClear>
												{brands &&
													brands.map((b, i) => (
														<Select.Option
															key={
																b.idProductSubFamily
															}
															value={
																b.idProductSubFamily
															}
														>
															{b.nameSubFamily}
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
											<Button block onClick={onReset}>
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
				footer={[
					<Button
						key="cancel"
						onClick={() => setDeleteOpen(false)}
					/>,
					<Button key="delete" onClick={handleDelete} />,
				]}
				okText="Eliminar"
				cancelText="Cancelar"
			>
				<p>
					Estas seguro de que deseas eliminar
					{` ${currentProduct?.nameProduct}`}
				</p>
			</Modal>
			{/* <Loading isLoading={loading} /> */}
		</DashboardLayout>
	);
}
