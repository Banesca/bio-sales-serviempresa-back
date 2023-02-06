import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Row, message, Typography } from 'antd';
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

	const getOrderRequest = async (id) => {
		setLoading(true);
		try {
			await getOrderById(id);
		} catch (error) {
			message.error('Error al cargar orden');
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
			console.log(error);
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

	// const getUserRequest = async (id) => {
	// 	const res = await requestHandler.get(`/api/v2/user/${id}`);
	// 	console.log(res.value);
	// 	if (res.isLeft()) {
	// 		return;
	// 	}
	// 	const value = res.value.getValue().data[0];
	// 	setUser(value);
	// };

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

	useEffect(() => {
		if (currentOrder) {
			calculateTotalRequest(currentOrder.idOrderH);
		}
	}, [currentOrder]);

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

	const handleCloseOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(
				statusNames['En Proceso'],
				currentOrder.idOrderH
			);
			router.push(`/dashboard/orders/${id}`);
		} catch (error) {
			console.error(error);
			message.error('Error al procesar pedido');
		} finally {
			setLoading(false);
		}
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
					<div></div>
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							color: 'white',
						}}
					>
						Tomar pedido
					</h1>
					<div>
						<Button
							onClick={() => setIsCloseOrderModal(true)}
							type="primary"
							style={{ marginRight: '1rem' }}
							disabled={!currentOrder?.body}
						>
							Procesar
						</Button>
					</div>
				</div>
				<Row style={{ height: '100vh', width: '100%' }}>
					<Col span={12} style={{ paddingRight: '.5rem' }}>
						<ProductFilter
							brands={brands}
							setQuery={setQuery}
							categories={categories}
							subCategories={subCategories}
							lines={lines}
							clean={clean}
						/>
						<ProductList
							products={filtered()}
							orderId={id}
							orderProducts={currentOrder?.body}
							getOrderRequest={getOrderRequest}
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
								{`Orden ${currentOrder?.numberOrden}`}
							</h2>
							<ProductsInOrder
								order={currentOrder}
								openDeleteModal={openDeleteModal}
								setProductsQuantity={setProductsQuantity}
								confirmProductQuantity={confirmProductQuantity}
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
				title="Procesar"
				open={closeOrderModal}
				onCancel={() => setIsCloseOrderModal(false)}
				onOk={() => handleCloseOrder()}
				cancelText="Cancelar"
				okText="Procesar"
			>
				<List
					dataSource={currentOrder?.body}
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
