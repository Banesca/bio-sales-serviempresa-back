/* eslint-disable indent */
import DashboardLayout from '../../../components/shared/layout';
import {
	Button,
	List,
	message,
	Table,
	Modal,
	Form,
	Row,
	Col,
	Input,
} from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import Loading from '../../../components/shared/loading';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GeneralContext } from '../../_app';
import { orderStatusToUse } from '.';
import DetailOrderTable from '../../../components/orders/detail/orderTable';
import ChangeOrderStatus from '../../../components/orders/detail/changeStatus';
import Title from '../../../components/shared/title';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useOrders } from '../../../components/orders/hooks/useOrders';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import { PROFILES, PROFILE_LIST } from '../../../components/shared/profiles';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useTdc } from '../../../components/tdc/useTdc';
import { useRequest } from '../../../hooks/useRequest';

const OrderDetail = () => {
	const router = useRouter();
	const [openModal2, setOpenModal2] = useState(false);
	const { id } = router?.query;
	const [log, setLog] = useState();
	const { actualTdc, updateTdc } = useTdc();
	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);
	const { requestHandler } = useRequest();
	const { loading, setLoading } = useLoadingContext();
	const { user, currentOrder, getOrderById, changeStatus } = useOrders();
	const { userProfile } = useAuthContext();
	const [dataSource, setDataSource] = useState([]);
	const generalContext = useContext(GeneralContext);
	const [model, setModel] = useState('');
	const getOrderRequest = async (id) => {
		setLoading(true);
		try {
			await getOrderById(id);
		} catch (error) {
			message.error('Error al cargar el pedido');
		} finally {
			setLoading(false);
		}
		console.log(currentOrder);
	};

	const getStatus = () => {
		let status = currentOrder.idStatusOrder;
		let color = '';
		status;
		if (status == 1) {
			color = '#ff6c0b';
		} else if (status == 2) {
			color = '#06a800';
		} else if (status == 3) {
			color = '#0984e3';
		} else if (status == 4) {
			color = '#ffd034';
		} else if (status == 5) {
			color = '#d63031';
		} else if (status == 6) {
			color = '#d63031';
		} else {
			color = '#969696';
		}
		return color;
	};
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

	/* console.log(currentOrder.isPrintBillin);//newtotal
	console.log(currentOrder.waste); */ //totaldeclardo

	console.log(actualTdc);

	const attributes = [
		'mpCash',
		'mpCreditCard',
		'mpDebitCard',
		'mpTranferBack',
		'mpMpago',
		'mpRappi',
		'mpGlovo',
		'mpUber',
		'mpPedidosya',
		'mpJust',
		'mpWabi',
		'mpOtro2',
		'mpPedidosyacash',
		'mpPersonal',
		'mpRapicash',
		'mpPresent',
		'mpPaypal',
		'mpZelle',
		'mpBofa',
		'mpYumi',
	];

	const mpObjects = attributes
		.map((key) => ({
			name: key,
			monto: currentOrder && currentOrder[key] ? currentOrder[key] : 0,
		}))
		.filter((obj) => obj.monto > 0);

	const captureElement = async (elementId) => {
		const element = document.getElementById(elementId);
		if (element) {
			const img = document.createElement('img');
			img.src = '/Images/LOGO.png';
			img.style.maxWidth = '150px';
			img.style.maxHeight = '150px';
			element.insertBefore(img, element.firstChild);
			const canvas = await html2canvas(element);
			const imgData = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.href = imgData;
			link.download = 'image.png';
			link.click();

			element.removeChild(img);
		} else {
			console.error(`Element with id "${elementId}" not found`);
		}
	};

	const handleChangeStatus = async (status) => {
		setLoading(true);
		try {
			await changeStatus(status, id);
			message.success('Pedido actualizado');
			status;
		} catch (error) {
			message.error('Error al actualizar pedido');
		} finally {
			setLoading(false);
		}
	};

	const handleOrder = () => {
		setLoading(true);
		router.push(`/dashboard/orders/update/${id}`);
	};
	const handleInputChange = (e) => {
		setModel(e.target.value);
	};
	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length && id) {
			getOrderRequest(id);
		}
	}, [generalContext, id]);

	if (loading || !currentOrder) {
		return (
			<DashboardLayout>
				<Loading isLoading={loading} />
			</DashboardLayout>
		);
	}

	const openTrucks = () => {
		setOpenModal2(true);
	};
	const closeModals = () => {
		setOpenModal2(false);
	};

	const handleButtonClick = () => {
		router.push(`/dashboard/orders/update/${id}`);
	};
	let idOrderH = currentOrder.idOrderH;

	const actualizaciónFactura = () => {
		console.log(idOrderH);

		const res = requestHandler.put(`/api/v2/order/update/seniat/${id}`, {factura:model});
		console.log(res);
		message.success('Factura actualizada');
	};

	const commonData = {
		'Numero del pedido': currentOrder.numberOrden,
		Vendedor: user?.fullname,
		Estado: orderStatusToUse[currentOrder.idStatusOrder].state,
		Cliente: currentOrder.fullNameClient,
		Contacto: currentOrder.phoneClient,
		Dirección: currentOrder.address,
		'Fecha de creacion': new Date(
			currentOrder.fechaEntrega
		).toLocaleDateString(),
		'Observacion (opcional):': currentOrder.comments,
	};
	const ExcelExport = [commonData];

	(currentOrder?.body || []).forEach((item, index) => {
		const productData = {
			'Nombre del pruducto': item.nameProduct,
			Código: item.barCode,
			Precio: item.priceSale,
			Cantidad: item.weight,
			'Sub Total': item.weight * item.priceSale,
			Total: currentOrder?.totalBot,
		};
		ExcelExport.push(productData);
	});

	console.log(currentOrder);
	console.log(currentOrder.idOrderH);
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
				<div style={{ display: 'flex', width: '90%' }}>
					<Title
						title="Detalle de pédido"
						path="/dashboard/orders"
						goBack={1}
					/>
					<div style={{ display: 'flex' }}>
						<Button
							htmlType="submit"
							type="success"
							onClick={() => captureElement('factura')}
							block
							style={{ width: '100%' }}
						>
							<ExportOutlined /> Imprimir recibo
						</Button>
					</div>
					<div style={{ display: 'flex', marginLeft: '10px' }}>
						<Button
							htmlType="submit"
							type="success"
							onClick={() => openTrucks()}
							block
							style={{ width: '100%' }}
						>
							Agregar factura
						</Button>
					</div>
					<div style={{ display: 'flex', width: '12%', marginLeft: '10px' }}>
						<Button
							htmlType="submit"
							type="success"
							block
							disabled={
								orderStatusToUse[currentOrder.idStatusOrder].state ==
									'Cobrado' ||
								orderStatusToUse[currentOrder.idStatusOrder].state ==
									'Despachado' ||
								orderStatusToUse[currentOrder.idStatusOrder].state ==
									'Anulado' ||
								orderStatusToUse[currentOrder.idStatusOrder].state == 'Pagado'
							}
							onClick={handleButtonClick}
						>
							Pagar
						</Button>
					</div>
				</div>
				<div
					id="factura"
					style={{
						width: '96%',
					}}
				>
					<List
						style={{
							width: '100%',
							padding: '10px 30px',
							backgroundColor: 'white',
							marginBottom: '25px',
							borderRadius: '15px',
							boxShadow: '4px 4px 8px rgba(207, 207, 207, 0.479)',
						}}
					>
						<ChangeOrderStatus
							status={currentOrder.idStatusOrder}
							handleOrder={handleOrder}
							orderId={id}
							handleChangeStatus={handleChangeStatus}
						/>

						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Número de pedido:</p>
							<p>{currentOrder.numberOrden}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Vendedor:</p>
							<p>{user?.fullname}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Estado:</p>
							<p style={{ color: `${getStatus()}`, fontWeight: 'bold' }}>
								{orderStatusToUse[currentOrder.idStatusOrder].state}
							</p>
						</List.Item>
						<List.Item>
							<p></p>
							<p style={{ fontWeight: 'bold', color: 'red' }}>
								{currentOrder.isacountCourrient === 1 ? 'Orden a crédito' : ''}
							</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Cliente:</p>
							<p>{currentOrder.fullNameClient}</p>
						</List.Item>

						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Contacto:</p>
							<p>{currentOrder.phoneClient}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Dirección:</p>
							<p>{currentOrder.address}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Fecha de creación:</p>
							<p>{new Date(currentOrder.fechaEntrega).toLocaleDateString()}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Numero de factura:</p>
							<p>{currentOrder.facturaAfip}</p>
						</List.Item>
						<List.Item>
							<p style={{ fontWeight: 'bold' }}>Comprobante de pago:</p>
							<p>{currentOrder.Urlbank}</p>
						</List.Item>

						<List.Item>
							<p style={{ fontWeight: 'bold', width: '100%' }}>
								Observacion (opcional):
							</p>
							<p style={{}}>{currentOrder.comments}</p>
						</List.Item>
					</List>
					<DetailOrderTable
						products={currentOrder?.body}
						total={currentOrder.totalBot}
					/>
					<Table
						style={{ width: '100%' }}
						bordered
						columns={defaultColumns2}
						dataSource={mpObjects}
					/>
				</div>
			</div>
			<Modal open={openModal2} onCancel={closeModals} footer={false}>
				<div className="flex flex-col gap-5">
					<h1>Agregar factura</h1>
					<Form layout="vertical">
						<Form.Item label="Numero de factura" name="model">
							<Input onChange={handleInputChange} />
						</Form.Item>

						<div className="flex flex-row gap-5">
							<Button onClick={() => actualizaciónFactura(idOrderH)}>
								Aceptar
							</Button>
							<Button close={() => setOpenModal2(false)}>Cerrar</Button>
						</div>
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default OrderDetail;
