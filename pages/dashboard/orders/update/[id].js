import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState, useRef } from 'react';
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
	Input,
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
	DeleteOutlined,
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
	const [PaymentTipe, setPaymentTipe] = useState();
	const [PaymentAddTipe, setPaymentToAddTipe] = useState([]);
	const generalContext = useContext(GeneralContext);
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [currentProduct, setCurrentProduct] = useState();
	const [total, setTotal] = useState(0);
	const [closeOrderModal, setIsCloseOrderModal] = useState(false);
	const [cancelOrderModal, setIsCancelOrderModal] = useState(false);
	const [pauseOrderModal, setIsPauseOrderModal] = useState(false);
	const [dataSource, setDataSource] = useState([]);
	const [count, setCount] = useState(1);
	const [newTotal, setNewTotal] = useState(0);
	const [totalDeclarado, setTotalDecla] = useState();
	const [client, setClient] = useState({});
	const EditableContext = React.createContext(null);

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

	const getPaymentTipe = async () => {
		const res = await requestHandler.get('/api/v2/paymentcondition/list');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		setPaymentTipe(res.value.getValue().response);
		console.log(PaymentTipe);
	};

	useEffect(() => {
		if (products) {
			addKeys(products);
			setProduct(products);
			getPayments();
			getPaymentTipe();
		}
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
	}, [currentOrder, getOrderRequest]);

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

	const handleAdd = (selectOption) => {
		setPaymentToAdd();
		const newData = {
			key: count,
			name: selectOption,
			monto: '0',
		};
		setDataSource([...dataSource, newData]);
		setCount(count + 1);
	};

	const EditableRow = ({ index, ...props }) => {
		const [form] = Form.useForm();
		return (
			<Form form={form} component={false}>
				<EditableContext.Provider value={form}>
					<tr {...props} />
				</EditableContext.Provider>
			</Form>
		);
	};

	const EditableCell = ({
		title,
		editable,
		children,
		dataIndex,
		record,
		handleSave,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const inputRef = useRef(null);
		const form = useContext(EditableContext);
		useEffect(() => {
			if (editing) {
				inputRef.current.focus();
			}
		}, [editing]);
		const toggleEdit = () => {
			setEditing(!editing);
			form.setFieldsValue({
				[dataIndex]: record[dataIndex],
			});
		};
		const save = async () => {
			try {
				const values = await form.validateFields();
				toggleEdit();
				handleSave({
					...record,
					...values,
				});
			} catch (errInfo) {
				console.log('Save failed:', errInfo);
			}
		};
		let childNode = children;
		if (editable) {
			childNode = editing ? (
				<Form.Item
					style={{
						margin: 0,
					}}
					name={dataIndex}
				>
					<Input ref={inputRef} onPressEnter={save} onBlur={save} />
				</Form.Item>
			) : (
				<div
					className="editable-cell-value-wrap"
					style={{
						paddingRight: 24,
					}}
					onClick={toggleEdit}
				>
					{children}
				</div>
			);
		}

		return <td {...restProps}>{childNode}</td>;
	};

	const handleSave = (row) => {
		const newData = [...dataSource];
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];

		newData.splice(index, 1, {
			...item,
			...row,
		});

		setDataSource(newData);

		const calcularSumaTotal = () => {
			let suma = 0;
			newData.forEach((objeto) => {
				suma += Number(objeto.monto);
				console.log(suma);
			});
			return suma;
		};
		
		const sumaTotal = calcularSumaTotal();
		
		setTotalDecla(sumaTotal);
		setNewTotal(total - sumaTotal);
	};

	const handleDelete = (key) => {
		const newData = dataSource.filter((item) => item.key !== key);
		setDataSource(newData);
		
		const calcularSumaTotal = () => {
			let suma = 0;
			newData.forEach((objeto) => {
				suma += Number(objeto.monto);
				console.log(suma);
			});
			return suma;
		};
		
		sumaTotal = calcularSumaTotal();
		setTotalDecla(sumaTotal);
		setNewTotal(total - sumaTotal);
	};

	const defaultColumns = [
		{
			title: 'Metodo de pago',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Monto a pagar',
			dataIndex: 'monto',
			key: 'monto',
			editable: true,
		},
		{
			title: 'Accion',
			dataIndex: 'operation',
			render: (_, record) =>
				dataSource.length >= 1 ? (
					<Button
						onClick={() => handleDelete(record.key)}
						type="primary"
						danger
					>
						<DeleteOutlined />
					</Button>
				) : null,
		},
	];

	const columns = defaultColumns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
			}),
		};
	});

	const defaultColumns2 = [
		{
			title: 'Metodo de pago',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Monto a pagar',
			dataIndex: 'monto',
			key: 'monto',
		},
	];
	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const getDebtsbyClient = async (phoneNumber) => {
		setLoading(true);
		console.log(phoneNumber);
		try {
			const res = await requestHandler.post(
				'/api/v2/order/all/currentacount/hasto',
				{
					query: phoneNumber,
				}
			);
			if (res.isLeft()) {
				throw res.value.getErrorValue();
			}
			const value = res.value.getValue().data;
			setdebts(value);
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (Object.keys(client).length) {
			getDebtsbyClient(client.phone);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [client]);

	const handleReceiveOrder = async () => {
		setLoading(true);
		try {
			await changeStatus(statusNames.Pagado, currentOrder.idOrderH);
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
			await changeStatus(statusNames['Por pagar'], currentOrder.idOrderH);
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
												<strong>Condicion de pago</strong>
											</p>

											<Select
												value={PaymentAddTipe}
												onChange={(v) => setPaymentToAddTipe(v)}
												style={{ width: '50%' }}
												placeholder="Ingrese condicion de pago"
											>
												{PaymentTipe &&
													PaymentTipe.map((PaymentTipe) => (
														<Select.Option
															key={PaymentTipe.idPaymenConditions}
															value={PaymentTipe.idPaymenConditions}
														>
															{PaymentTipe.note}
														</Select.Option>
													))}
											</Select>
										</List.Item>

										<List.Item>
											<p>
												<strong>Metodo de pago</strong>
											</p>

											<Select
												placeholder="Ingrese metodos de pago"
												style={{ width: '50%' }}
												value={PaymentAdd}
												onChange={handleAdd}
											>
												{Payment &&
													Payment.map((Payment) => (
														<Select.Option
															key={Payment.idPymentMethod}
															value={Payment.pymentMethod}
														>
															{Payment.pymentMethod}
														</Select.Option>
													))}
											</Select>
										</List.Item>
										<List.Item>
											<p>
												<strong>TOTAL:</strong>
											</p>
											<p>
												<strong>${total}</strong>
											</p>
											<p>
												<strong>DECLARADO:</strong>
											</p>
											<p>
												<strong style={{ color: 'blue' }}>
													${totalDeclarado}
												</strong>
											</p>
											<p>
												<strong>RESTANTE:</strong>
											</p>
											<p>
												<strong style={{ color: 'red' }}>${newTotal}</strong>
											</p>
										</List.Item>
										<Table
											bordered
											columns={columns}
											dataSource={dataSource}
											rowClassName={() => 'editable-row'}
											components={components}
										/>
										<br></br>
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
						<p>
							<strong>DECLARADO</strong>
						</p>
						<p>
							<strong style={{ color: 'blue' }}>${totalDeclarado}</strong>
						</p>
						<p>
							<strong>RESTANTE</strong>
						</p>
						<p>
							<strong style={{ color: 'red' }}>${newTotal}</strong>
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
										disabled="true"
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
					<List.Item style={{display:'flex', justifyContent:'center'}}>
						<Table
							style={{width:'100%'}}
							bordered
							columns={defaultColumns2}
							dataSource={dataSource}
							rowClassName={() => 'editable-row'}
							components={components}
						/>
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
					¿Estás seguro que deseas pausar la orden?
					<br /> Podrás acceder previamente a la orden pausada desde el módulo
					de ordenes. <br />
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
