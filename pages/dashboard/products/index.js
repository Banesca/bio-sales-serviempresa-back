import { useContext, useEffect, useMemo, useState } from 'react';

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
import ProductFilter from '../../../components/products/productFilter';

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
				<p style={{ color: record.isPromo == '1' && 'green' }}>
					${record.isPromo == '1' ? record.marketPrice : text}
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
	const [products, setProducts] = useState([]);

	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const INITIAL_QUERY_VALUES = {
		nameProduct: '',
		barCode: '',
		minPrice: 0,
		maxPrice: 0,
		nameFamily: '',
		nameSubFamily: '',
	};

	const [query, setQuery] = useState(INITIAL_QUERY_VALUES);

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

	const productsList = useMemo(() => {
		let list = products;
		if (query.nameProduct) {
			list = list.filter((p) =>
				p.nameProduct
					.toLowerCase()
					.includes(query.nameProduct.toLowerCase())
			);
		}
		if (query.barCode) {
			list = list.filter((p) => {
				if (!p.barCode) {
					return;
				}
				return p.barCode.includes(query.barCode);
			});
		}
		if (query.minPrice) {
			list = list.filter((p) => p.priceSale > Number(query.minPrice));
		}
		if (query.maxPrice) {
			list = list.filter((p) => p.priceSale < Number(query.maxPrice));
		}
		if (query.nameFamily) {
			console.log('filter category');
			list = list.filter((p) => p.idProductFamily === query.nameFamily);
		}
		if (query.nameSubFamily) {
			list = list.filter(
				(p) => p.idProductSubFamily === query.nameSubFamily
			);
		}
		return list;
	}, [products, query]);

	console.log('Lista', productsList);

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
						<Button style={{ marginRight: '1rem' }} type="primary">
							<Link href="products/import">Importar</Link>
						</Button>
						<Button type="primary">
							<Link href="products/add">Agregar</Link>
						</Button>
					</Col>
				</Row>
				<SelectBusiness />

				<ProductFilter
					setQuery={setQuery}
					initialValues={INITIAL_QUERY_VALUES}
					categories={categories}
					brands={brands}
				/>
				<Table
					columns={columns}
					dataSource={productsList}
					loading={loading}
				/>
			</div>
			<Modal
				title="Eliminar"
				open={deleteModalOpen}
				onCancel={() => setDeleteModalOpen(false)}
				onOk={handleDelete}
				footer={[
					<Button key="cancel" onClick={() => setDeleteOpen(false)}>
						Cancelar
					</Button>,
					<Button
						key="delete"
						danger
						type="primary"
						onClick={handleDelete}
					>
						Eliminar
					</Button>,
				]}
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
