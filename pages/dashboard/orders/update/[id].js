import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/layout';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GeneralContext } from '../../../_app';
import { useRequest } from '../../../../hooks/useRequest';
import {
	ArrowLeftOutlined,
	BorderBottomOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import { Button, Col, Collapse, Row, Table } from 'antd';
import { Typography } from 'antd';
import { Form } from 'antd';
import { Input } from 'antd';
import { Select } from 'antd';
import ProductFilter from '../../../../components/products/productFilter';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';
import { addKeys } from '../../../../util/setKeys';
import { Space } from 'antd';
import { message } from 'antd';

const UpdateOrderPage = () => {
	const AddColumns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 2,
			render: (text, record) => (
				<p style={{ color: record.isPromo == '1' && 'green' }}>
					${record.isPromo == '1' ? record.marketPrice : text}
				</p>
			),
		},
		{
			title: 'Acciones',
			key: 3,
			render: (text, record) => (
				<Space>
					<Button
						type="primary"
						onClick={() => handleAddProduct(record)}
					>
						Agregar
					</Button>
				</Space>
			),
		},
	];

	const orderColumns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 2,
			render: (text, record) => (
				<p style={{ color: record.isPromo == '1' && 'green' }}>
					${record.isPromo == '1' ? record.marketPrice : text}
				</p>
			),
		},
		{
			title: 'Cantidad',
			dataIndex: 'weight',
			key: 3,
			render: (number, record, index) => (
				<Space>
					<Input
						type="number"
						style={{ width: '80px' }}
						value={order.body[index].weight}
						onChange={(e) => {
							let obj = order;
							obj.body[index].weight = e.target.value;
							setOrder({...obj});
						}}
					/>
					<Button
						type="primary"
						onClick={() => handleUpdateProduct(record)}
					>
						Ok
					</Button>
				</Space>
			),
		},
		{
			title: 'Acciones',
			key: 3,
			render: () => (
				<Space>
					<Button type="primary" danger>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();
	const { id } = router.query;

	const INITIAL_QUERY_VALUES = {
		nameProduct: '',
		barCode: '',
		minPrice: 0,
		maxPrice: 0,
		nameFamily: '',
		nameSubFamily: '',
	};

	const [order, setOrder] = useState();
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(true);
	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [query, setQuery] = useState(INITIAL_QUERY_VALUES);

	const handleReturn = () => {
		router.push('/dashboard/orders');
	};

	const getOrderRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/order/byidH/${id}`);
		console.log(res.value);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setOrder(value);
		console.log(value);
		setLoading(false);
	};

	const getUserRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/user/${id}`);
		console.log(res.value);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data[0];
		setUser(value);
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

	const generalContext = useContext(GeneralContext);
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	useEffect(() => {
		if (generalContext && selectedBusiness) {
			getOrderRequest(id);
			categoryListRequest(selectedBusiness.idSucursal);
			brandListRequest(selectedBusiness.idSucursal);
			handleListProductRequest(0, 0, selectedBusiness.idSucursal);
		}
	}, [generalContext, id, selectedBusiness]);

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

	const handleUpdateProduct = async (record) => {
		setLoading(true);
		console.log(record);
		const res = await requestHandler.post(
			`/api/v2/order/product/setweight`,
			{ idOrderB: record.idOrderB, weight: record.weight }
		);
		console.log(res);
		if (res.isLeft()) {
			message.error('Ha ocurrido un error');
		}
		setLoading(false);
		await getOrderRequest(id);
		message.success('Cantidad actualizada');
	};

	const handleAddProduct = async (record) => {
		const res = await requestHandler.post(`/api/v2/order/product/add`, {
			idOrderHFk: id,
			idProductFk: record.idProduct,
			idStatusFk: 1,
			idUserAddFk: localStorage.getItem('userId'),
			priceProductOrder: record.priceSale,
			quantityProduct: 1,
		});
		console.log(res);
		await getOrderRequest(id);
	};

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<ArrowLeftOutlined
						style={{ fontSize: '1.5rem', color: 'white' }}
						onClick={handleReturn}
					/>
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							color: 'white',
						}}
					>
						Actualizar Orden
					</h1>
					<div></div>
				</div>
				<Row style={{ height: '100vh', width: '100%' }}>
					<Col span={12} style={{ paddingRight: '.5rem' }}>
						<ProductFilter
							brands={brands}
							setQuery={setQuery}
							categories={categories}
							initialValues={INITIAL_QUERY_VALUES}
						/>
						<Table
							dataSource={productsList}
							columns={AddColumns}
							loading={loading}
						/>
					</Col>
					<Col span={12}>
						<Typography>
							<h2
								style={{
									height: '46px',
									textAlign: 'center',
									margin: '0 0 2rem 0',
								}}
							>
								{`Orden ${order?.numberOrden}`}
							</h2>
							<Table
								columns={orderColumns}
								loading={loading}
								dataSource={order?.body ? order.body : null}
							/>
						</Typography>
					</Col>
				</Row>
			</div>
		</DashboardLayout>
	);
};

export default UpdateOrderPage;
