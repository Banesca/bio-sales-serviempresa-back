import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import {
	Col,
	Row,
	message,
	Typography,
	Button,
	Form,
	Select,
	Card,
	Table,
} from 'antd';
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
import {
	ArrowLeftOutlined,
	LeftOutlined,
	PauseOutlined,
	CloseOutlined,
} from '@ant-design/icons';

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
	const [Payment, setPayment] = useState();
	const [PaymentAdd, setPaymentToAdd] = useState([]);

	const [deleteOpen, setDeleteOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState();
	const [total, setTotal] = useState(0);
	const [closeOrderModal, setIsCloseOrderModal] = useState(false);
	const [cancelOrderModal, setIsCancelOrderModal] = useState(false);
	const [pauseOrderModal, setIsPauseOrderModal] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [count, setCount] = useState(2);

	const columns = [
		{
			title: 'Metodo de pago',
			dataIndex: 'pymentMethod',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Monto a pagar',
			key: 3,
		},
	];

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

	const getPayments = async () => {
		const res = await requestHandler.get('/api/v2/utils/typepayment');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		setPayment(res.value.getValue().response);
		console.log(Payment);
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
			getPayments();
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

	useEffect(() => {
		if (currentOrder) {
			calculateTotalRequest(currentOrder.idOrderH);
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

	const handleAdd = () => {
		console.log(Payment);
		const newData = {
			title: 'hola',
		};
		setDataSource([...dataSource, newData]);
	};

	const handleDelete = async () => {
		await handleRemoveProduct(currentProduct);
		setDeleteOpen(false);
	};

	const handleReceiveOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames.Facturado, currentOrder.idOrderH);
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
			await changeStatus(statusNames['Por facturar'], currentOrder.idOrderH);
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
						Agregar productos
					</h1>
					<div className="flex gap-4">
						<Button
							onClick={() => setIsCancelOrderModal(true)}
							type="primary"
							danger
						>
							<CloseOutlined /> Anular
						</Button>
						<Button onClick={() => setIsPauseOrderModal(true)} type="info">
							<PauseOutlined /> Pausar
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
							<div className="w-[43%]">
								<ProductList
									products={filtered()}
									orderId={id}
									orderProducts={currentOrder?.body}
									getOrderRequest={getOrderRequest}
								/>
							</div>

							<div className="w-[56%] flex flex-col gap-5">
								<ProductsInOrder
									order={currentOrder}
									openDeleteModal={openDeleteModal}
									setProductsQuantity={setProductsQuantity}
									confirmProductQuantity={confirmProductQuantity}
								/>
								<Card className="rounded-2x1 shadow-lg">
									<List dataSource={currentOrder?.body}>
										<List.Item>
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

											<Select
												/* mode="multiple" */
												placeholder="Ingrese metodos de pago"
												style={{ width: '50%' }}
												value={PaymentAdd}
												onChange={(v) => setPaymentToAdd(v)}
											>
												{Payment &&
													Payment.map((Payment) => (
														<Select.Option
															onChange={handleAdd}
															onClick={handleAdd}
															key={Payment.idPymentMethod}
															value={Payment.idPymentMethod}
														>
															{Payment.pymentMethod}
														</Select.Option>
													))}
											</Select>
										</List.Item>

										<Table columns={columns} dataSource={dataSource} />

										<List.Item>
											<div></div>
											<div className="flex justify-end">
												<Button
													onClick={() => setIsCloseOrderModal(true)}
													type="primary"
													className="bg-blue-500"
													disabled={!currentOrder?.body}
												>
													Enviar
												</Button>
											</div>
										</List.Item>
									</List>
								</Card>
							</div>
						</Typography>
					</Col>
				</Row>
			</div>
			<Modal
				title="Confirmación"
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
					¿Está seguro de que deseas anular?
					{` ${currentProduct?.nameProduct}`}
				</p>
			</Modal>
			<Modal
				title="Confirmación"
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
								description={`Cantidad: ${item.weight} | Precio: $ ${
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
									<Select
										mode="multiple"
										placeholder="Ingrese metodos de pago"
										style={{ width: '100%' }}
										value={PaymentAdd}
										onChange={(v) => setPaymentToAdd(v)}
									>
										{Payment &&
											Payment.map((Payment) => (
												<Select.Option
													key={Payment.idPymentMethod}
													value={Payment.idPymentMethod}
												>
													{Payment.pymentMethod}
												</Select.Option>
											))}
									</Select>
								</Form.Item>
							</Form>
						</p>
					</List.Item>
				</List>
			</Modal>
			<Modal
				title="Confirmación"
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
					¿Estás seguro que deseas pausar el pedido?
					<br /> Podrás acceder previamente al pedido pausado desde el módulo de
					pedidos. <br />
				</p>
			</Modal>
			<Modal
				title="Confirmación"
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
				<p>¿Está seguro de que deseas anular esta orden?</p>
			</Modal>
		</DashboardLayout>
	);
};

export default UpdateOrderPage;
