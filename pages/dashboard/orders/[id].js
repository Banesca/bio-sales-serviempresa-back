/* eslint-disable indent */
import DashboardLayout from '../../../components/shared/layout';
import { Button, List, message } from 'antd';
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

const OrderDetail = () => {
	const router = useRouter();

	const { id } = router?.query;
	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);

	const { loading, setLoading } = useLoadingContext();
	const { user, currentOrder, getOrderById, changeStatus } = useOrders();
	const { userProfile } = useAuthContext();

	const generalContext = useContext(GeneralContext);

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

	const captureElement = async (elementId) => {
		const element = document.getElementById(elementId);
		if (element) {
			const canvas = await html2canvas(element);
			const imgData = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.href = imgData;
			link.download = 'image.png';
			link.click();
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

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(ExcelExport);
		const range = XLSX.utils.decode_range(worksheet['!ref']);
		for (let R = range.s.r; R <= range.e.r; ++R) {
			for (let C = range.s.c; C <= range.e.c; ++C) {
				const cell_address = { c: C, r: R };
				const cell_ref = XLSX.utils.encode_cell(cell_address);

				if (!worksheet[cell_ref]) continue;

				worksheet[cell_ref].s = {
					font: {
						bold: true,
						color: { rgb: 'FFFFFF' },
					},
					fill: {
						fgColor: { rgb: '000000' },
					},
				};
			}
		}

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
		XLSX.writeFile(workbook, 'Recibo.xlsx');
	};

	const handleButtonClick = () => {
		router.push(`/dashboard/orders/update/${id}`);
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
				<div id="factura">
					<List
						style={{
							width: '96%',
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
							<p style={{ fontWeight: 'bold' }}>Observacion (opcional):</p>
							<p style={{}}>{currentOrder.comments}</p>
						</List.Item>
						<List.Item>
							<p></p>
							<p style={{ fontWeight: 'bold', color: 'red' }}>
								{currentOrder.isacountCourrient === 1 ? 'Orden a crédito' : ''}
							</p>
						</List.Item>
					</List>
					<DetailOrderTable
						products={currentOrder?.body}
						total={currentOrder?.totalBot}
					/>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default OrderDetail;
