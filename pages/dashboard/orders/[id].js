/* eslint-disable indent */
import DashboardLayout from '../../../components/shared/layout';
import { Button, List, message } from 'antd';
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
import DocPdf from './DocPdf';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

const OrderDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const [log, setLog] = useState();
	const [verPdf, setVerPdf] = useState(false);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, id]);

	if (loading || !currentOrder) {
		return (
			<DashboardLayout>
				<Loading isLoading={loading} />
			</DashboardLayout>
		);
	}

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
					<div style={{ display: 'flex', width: '12%' }}>
						<PDFDownloadLink
							document={
								<DocPdf
									currentOrder={currentOrder}
									orderStatusToUs={orderStatusToUse}
									user={user}
								/>
							}
							fileName='Orden N.pdf'
						>
							<Button
								htmlType="submit"
								type="success"
								block
								onClick={() => {
									setVerPdf();
								}}
							>
								Imprimir recibo
							</Button>
						</PDFDownloadLink>
					</div>
				</div>

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
					{log == user?.isUser ||
					userProfile == PROFILES.MASTER ||
					userProfile == PROFILES.ADMIN ? (
						<ChangeOrderStatus
							status={currentOrder.idStatusOrder}
							handleOrder={handleOrder}
							orderId={id}
							handleChangeStatus={handleChangeStatus}
						/>
					) : (
						<></>
					)}
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
				</List>
				<DetailOrderTable
					products={currentOrder?.body}
					total={currentOrder?.totalBot}
				/>
			</div>
		</DashboardLayout>
	);
};

export default OrderDetail;
