import { useRouter } from 'next/router';
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from 'react';
import {
	ArrowLeftOutlined,
	DeleteOutlined,
	ExceptionOutlined,
	ExclamationCircleFilled,
} from '@ant-design/icons';
import {
	Button,
	Col,
	Row,
	Table,
	Form,
	Input,
	Space,
	message,
	Typography,
} from 'antd';
import DashboardLayout from '../../../../components/layout';
import { GeneralContext } from '../../../_app';
import { useRequest } from '../../../../hooks/useRequest';
import ProductFilter from '../../../../components/products/productFilter';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';
import { addKeys } from '../../../../util/setKeys';
import { Modal } from 'antd';
import { useProductFilter } from '../../../../components/products/useProductFilter';
import { List } from 'antd';

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
							setOrder({ ...obj });
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
			render: (record) => (
				<Space>
					<Button
						onClick={() => deleteModalOpen(record)}
						type="primary"
						danger
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const router = useRouter();
	const { id } = router.query;

	const { filtered, clean, setProduct, setQuery } = useProductFilter();

	const [order, setOrder] = useState();
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(true);
	const [brands, setBrands] = useState([]);
	const [categories, setCategories] = useState([]);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState();
	const [total, setTotal] = useState(0);
	const [closeOrderModal, setIsCloseOrderModal] = useState(false);
	const [cancelOrderModal, setIsCancelOrderModal] = useState(false);

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
		//dispatch({ type: FILTER_ACTIONS.GET_PRODUCTS, payload: value });
		setProduct(value);
		setLoading(false);
	};

	const calculateTotalRequest = async () => {
		const res = await requestHandler.get(
			`/api/v2/order/calculate/total/${id}`
		);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue();
		setTotal(value.message[0].TOTAL);
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

	useEffect(() => {
		if (generalContext) {
			calculateTotalRequest();
		}
	}, [order]);

	const handleUpdateProduct = async (record) => {
		setLoading(true);
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
		let index = 0;
		let found = false;
		if (order.body) {
			for (const o of order.body) {
				if (o.idProduct === record.idProduct) {
					found = true;
					break;
				}
				index += 1;
			}
			if (found) {
				let obj = order;
				obj.body[index].weight += 1;
				await handleUpdateProduct(obj.body[index]);
				return;
			}
		}
		setLoading(true);
		const res = await requestHandler.post(`/api/v2/order/product/add`, {
			idOrderHFk: id,
			idProductFk: record.idProduct,
			idStatusFk: 1,
			idUserAddFk: localStorage.getItem('userId'),
			priceProductOrder: record.priceSale,
			quantityProduct: 1,
		});
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		await getOrderRequest(id);
		message.success('Producto agregado');
		setLoading(false);
	};

	const handleRemoveProduct = async (record) => {
		setLoading(true);
		const idUser = localStorage.getItem('userId');
		const res = await requestHandler.delete(
			`/api/v2/order/product/delete/${record.idOrderB}/${idUser}`
		);
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		await getOrderRequest(id);
		setLoading(false);
		message.success('Producto removido');
	};

	const deleteModalOpen = (product) => {
		setCurrentProduct(product);
		setDeleteOpen(true);
	};

	const handleDelete = async () => {
		await handleRemoveProduct(currentProduct);
		setDeleteOpen(false);
	};

	const handleCloseOrder = async () => {
		setLoading(true);
		const res = await requestHandler.put(`/api/v2/order/close/${id}`, {
			comments: '',
			mpCash: total,
			mpCreditCard: 0,
			mpDebitCard: 0,
			mpTranferBack: 0,
			totalBot: total,
			mpMpago: 0,
			idCurrencyFk: 1,
			listPaymentMethod: [],
			isAfip: '0',
			mpRappi: 0,
			mpGlovo: 0,
			mpUber: 0,
			mpPedidosya: 0,
			mpJust: 0,
			mpWabi: 0,
			mpOtro2: 0,
			mpPedidosyacash: 0,
			mpPersonal: 0,
			mpRapicash: 0,
			mpPresent: 0,
			mpPaypal: 0,
			mpZelle: 0,
			mpBofa: 0,
			mpYumi: 0,
			waste: 0,
			isPrintBillin: 0,
		});
		console.log(res);
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		setLoading(false);
		router.push(`/dashboard/orders/${id}`);
	};

	const handleCancelOrder = async () => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/order/satus/${id}/4`);
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		setIsCancelOrderModal(false);
		await getOrderRequest(id);
		setLoading(false);
		message.success('Orden cancelada');
	};

	useEffect(() => {
		if (order && order.idStatusOrder !== 1) {
			router.push(`/dashboard/orders/${id}`);
		}
	}, [id, order]);

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
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
					<div>
						<Button
							onClick={() => setIsCloseOrderModal(true)}
							type="primary"
							style={{ marginRight: '1rem' }}
							disabled={!order?.body}
						>
							Facturar
						</Button>
						<Button
							onClick={() => setIsCancelOrderModal(true)}
							type="primary"
							danger
						>
							Anular
						</Button>
					</div>
				</div>
				<Row style={{ height: '100vh', width: '100%' }}>
					<Col span={12} style={{ paddingRight: '.5rem' }}>
						<ProductFilter
							brands={brands}
							setQuery={setQuery}
							categories={categories}
							clean={clean}
						/>
						<Table
							dataSource={filtered()}
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
			<Modal
				title="Eliminar"
				open={deleteOpen}
				onCancel={() => setDeleteOpen(false)}
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
			<Modal
				title="Facturar"
				open={closeOrderModal}
				onCancel={() => setIsCloseOrderModal(false)}
				onOk={() => handleCloseOrder()}
				cancelText="Cancelar"
				okText="Facturar"
			>
				<List
					dataSource={order?.body}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta
								title={item.nameProduct}
								description={`Cantidad: ${
									item.weight
								} | Precio: $${item.priceSale.toFixed(2)}`}
							/>
							<p>SubTotal: ${item.weight * item.priceSale}</p>
						</List.Item>
					)}
				>
					<List.Item style={{ borderTop: '1px solid #eee' }}>
						<p>
							<strong>TOTAL</strong>
						</p>
						<p>
							<strong>${total}</strong>
						</p>
					</List.Item>
				</List>
			</Modal>
			<Modal
				title="Anular Orden"
				open={cancelOrderModal}
				onCancel={() => setIsCancelOrderModal(false)}
				onOk={handleCancelOrder}
				footer={[
					<Button
						key="cancel"
						onClick={() => setIsCancelOrderModal(false)}
					>
						Cancelar
					</Button>,
					<Button
						key="delete"
						danger
						type="primary"
						onClick={handleCancelOrder}
					>
						Anular
					</Button>,
				]}
			>
				<p>Estas seguro de que deseas anular esta orden?</p>
			</Modal>
		</DashboardLayout>
	);
};

export default UpdateOrderPage;
