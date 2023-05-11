import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Col, Row, message, Typography, Button, Form, Select } from 'antd';
import DashboardLayout from '../../../../components/shared/layout';
import { GeneralContext } from '../../../_app';
import { useRequest } from '../../../../hooks/useRequest';
import ProductFilter from '../../../../components/products/productFilter';
import { useBusinessProvider } from '../../../../hooks/useBusinessProvider';
import { addKeys } from '../../../../util/setKeys';
import { Modal } from 'antd';
import { useProductFilter } from '../../../../components/products/useProductFilter';
import { List } from 'antd';
import ProductList from '../../../../components/orders/update/productList';
import ProductsInOrder from '../../../../components/orders/update/productsInOrder';
import { useOrders } from '../../../../components/orders/hooks/useOrders';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';
import { useProducts } from '../../../../components/products/hooks/useProducts';
import { useCategoryContext } from '../../../../hooks/useCategoriesProvider';
import { useBrandContext } from '../../../../hooks/useBrandsProvider';
import { statusNames } from '../../../../components/orders/detail/changeStatus';
import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';

export const UNIT_TYPE = {
	UNIT: 17,
	KG: 3,
};

const UpdateOrderPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { filtered, clean, setProduct, setQuery } = useProductFilter();
	const { products, getProducts } = useProducts();
	const {
		currentOrder,
		getOrderById,
		changeStatus,
		setProductsQuantity,
		confirmProductQuantity,
	} = useOrders();
	const {
		categories,
		subCategories,
		lines,
		getCategories,
		getSubCategories,
		getLines,
	} = useCategoryContext();
	const { brands, getBrands } = useBrandContext();
	const { loading, setLoading } = useLoadingContext();

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState();
	const [total, setTotal] = useState(0);
	const [closeOrderModal, setIsCloseOrderModal] = useState(false);
	const [cancelOrderModal, setIsCancelOrderModal] = useState(false);
	const [pauseOrderModal, setIsPauseOrderModal] = useState(false);

	const getOrderRequest = async (id) => {
		setLoading(true);
		try {
			await getOrderById(id);
		} catch (error) {
			message.error('Error al cargar pedido');
		} finally {
			setLoading(false);
		}
	};

	const getCategoriesRequest = async (id) => {
		setLoading(true);
		try {
			await getCategories(id);
			await getSubCategories(id);
			await getLines(id);
		} catch (error) {
			message.error('Error al cargar categorías');
		} finally {
			setLoading(false);
		}
	};

	const getBrandsRequest = async (id) => {
		setLoading(true);
		try {
			await getBrands(id);
		} catch (error) {
			message.error('Error al cargar marcas');
		} finally {
			setLoading(false);
		}
	};

	const handleListProductRequest = async (id) => {
		setLoading(true);
		try {
			await getProducts(id);
		} catch (error) {
			message.error('Error al cargar productos');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (products) {
			addKeys(products);
			setProduct(products);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [products]);

	const calculateTotalRequest = async () => {
		const res = await requestHandler.get(`/api/v2/order/calculate/total/${id}`);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue();
		setTotal(value.message[0].TOTAL);
	};

	const createPayCondition = async (date, note) => {
		/* const res = await requestHandler.post('/api/v2/paymentcondition/add', {
			date,
			note
		}); */
		const res = await requestHandler.get('/api/v2/paymentcondition/list');
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue();
	};

	useEffect(() => {
		if (currentOrder) {
			calculateTotalRequest(currentOrder.idOrderH);
			createPayCondition(currentOrder.fechaEntrega, 'note');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentOrder, getOrderRequest]);

	const generalContext = useContext(GeneralContext);
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		if (
			Object.keys(generalContext).length &&
			Object.keys(selectedBusiness).length
		) {
			getOrderRequest(id);
			getBrandsRequest(selectedBusiness.idSucursal);
			getCategoriesRequest(selectedBusiness.idSucursal);
			handleListProductRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, id, selectedBusiness]);

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

	const openDeleteModal = (product) => {
		setCurrentProduct(product);
		setDeleteOpen(true);
	};

	const handleDelete = async () => {
		await handleRemoveProduct(currentProduct);
		setDeleteOpen(false);
	};

	const handleReceiveOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames['Recibido'], currentOrder.idOrderH);
			router.push(`/dashboard/orders/${id}`);
		} catch (error) {
			message.error('Error al recibir pedido');
		} finally {
			setLoading(false);
		}
	};
	const handlePauseOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames['En proceso'], currentOrder.idOrderH);
			router.push('/dashboard/orders');
		} catch (error) {
			message.error('Error al pausar pedido');
		} finally {
			setLoading(false);
		}
	};

	const handleCancelOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames.Anulado, currentOrder.idOrderH);
			router.push('/dashboard/orders');
		} catch (error) {
			message.error('Error al anular pedido');
		} finally {
			setLoading(false);
		}
	};

	const calculateSubTotal = (item) => {
		let subTotal = 0;
		if (item.idUnitMeasureSaleFk == UNIT_TYPE.KG) {
			subTotal =
				item.weight *
				(item.unitweight *
					(item.isPromo == '1' ? item.marketPrice : item.priceSale));
		} else {
			subTotal =
				item.weight * (item.isPromo == '1' ? item.marketPrice : item.priceSale);
		}
		return subTotal;
	};

	const handleReturn = () => {
		router.push('/dashboard/orders');
		setLoading(true);
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
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<div>
						<Button
							style={{
								marginRight: '50%',
								height: '42px',
								borderRadius: '20px',
							}}
							onClick={handleReturn}
						>
							<LeftOutlined
								style={{ fontSize: '1.5rem', marginRight: '50%' }}
							/>
						</Button>
					</div>
					<h1 className="text-center font-semibold text-4xl w-[350px]">
						Tomar pedido
					</h1>
					<div className="flex gap-4">
						<Button
							onClick={() => setIsCancelOrderModal(true)}
							type="primary"
							danger
						>
							Anular
						</Button>
						<Button onClick={() => setIsPauseOrderModal(true)} type="info">
							Pausar
						</Button>
						<Button
							onClick={() => setIsCloseOrderModal(true)}
							type="primary"
							className="bg-blue-500"
							disabled={!currentOrder?.body}
						>
							Enviar
						</Button>
					</div>
				</div>
				<Row className="h-screen w-full">
					<Col span={24}>
						<ProductFilter
							brands={brands}
							setQuery={setQuery}
							categories={categories}
							subCategories={subCategories}
							lines={lines}
							clean={clean}
						/>

						<Typography className="flex justify-between">
							<div className="w-[48%]">
								<ProductList
									products={filtered()}
									orderId={id}
									orderProducts={currentOrder?.body}
									getOrderRequest={getOrderRequest}
								/>
							</div>

							<div className="w-[48%]">
								<ProductsInOrder
									order={currentOrder}
									openDeleteModal={openDeleteModal}
									setProductsQuantity={setProductsQuantity}
									confirmProductQuantity={confirmProductQuantity}
								/>
							</div>
						</Typography>
					</Col>
				</Row>
			</div>
			<Modal
				title="Anular"
				open={deleteOpen}
				onCancel={() => setDeleteOpen(false)}
				onOk={handleCancelOrder}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => setDeleteOpen(false)}>
							Cancelar
						</Button>
						<Button
							key="delete"
							danger
							type="primary"
							onClick={handleCancelOrder}
						>
							Anular
						</Button>
					</div>,
				]}
			>
				<p>
					Estas seguro de que deseas eliminar
					{` ${currentProduct?.nameProduct}`}
				</p>
			</Modal>
			<Modal
				title="Enviar"
				className="send"
				open={closeOrderModal}
				onCancel={() => setIsCloseOrderModal(false)}
				onOk={() => handleReceiveOrder()}
				cancelText="Cancelar"
				okText="Enviar"
				okType="primary"
				closable="false"
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button
							key="cancel"
							danger
							onClick={() => setIsCloseOrderModal(false)}
						>
							Cancelar
						</Button>
						<Button
							key="delete"
							type="primary"
							className="bg-blue-500"
							onClick={() => handleReceiveOrder()}
						>
							Enviar
						</Button>
					</div>,
				]}
			>
				<List
					dataSource={currentOrder?.body}
					renderItem={(item) => (
						<List.Item>
							<List.Item.Meta
								title={item.nameProduct}
								description={`Cantidad: ${item.weight} | Precio: $${
									item.isPromo == 1
										? item.marketPrice.toFixed(2)
										: item.priceSale.toFixed(2)
								} ${
									item.idUnitMeasureSaleFk == UNIT_TYPE.KG
										? `| Peso: ${item.unitweight}KG`
										: ''
								}`}
							/>
							<p>SubTotal: $ {calculateSubTotal(item)}</p>
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
					<List.Item>
						<p>
							<strong>Metodo de pago</strong>
						</p>
						<p>
							<Form>
								<Form.Item className="w-32 my-auto">
									<Select />
								</Form.Item>
							</Form>
						</p>
					</List.Item>
				</List>
			</Modal>
			<Modal
				title="Pausar pedido"
				open={pauseOrderModal}
				onCancel={() => setIsPauseOrderModal(false)}
				onOk={handlePauseOrder}
				closable="false"
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button
							key="cancel"
							danger
							onClick={() => setIsPauseOrderModal(false)}
						>
							Cancelar
						</Button>
						<Button key="delete" type="info" onClick={handlePauseOrder}>
							Pausar
						</Button>
					</div>,
				]}
			>
				<p>
					{' '}
					¿Estás seguro que deseas pausar el pedido? Podrás acceder previamente
					al pedido pausado desde el módulo de pedidos. <br />
				</p>
			</Modal>
			<Modal
				title="Eliminar"
				open={cancelOrderModal}
				onCancel={() => setIsCancelOrderModal(false)}
				onOk={handleCancelOrder}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => setIsCancelOrderModal(false)}>
							Cancelar
						</Button>
						<Button
							key="delete"
							danger
							type="primary"
							onClick={handleCancelOrder}
						>
							Anular
						</Button>
					</div>,
				]}
			>
				<p>¿Estas seguro de que deseas anular esta orden?</p>
			</Modal>
		</DashboardLayout>
	);
};

export default UpdateOrderPage;
