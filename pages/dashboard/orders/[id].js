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
const OrderDetail = () => {
	const router = useRouter();
	const { id } = router.query;

	const { loading, setLoading } = useLoadingContext();
	const { user, currentOrder, getOrderById, changeStatus } = useOrders();

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
		(status);
		if(status == 1) {
			color = '#ff6c0b';
		} else if (status == 2) {
			color = '#06a800';
		} else if (status == 3) {
			color = '#0984e3';
		} else if (status == 4) {
			color = '#ffd034';
		} else if (status == 5) {
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
			message.success('Estado actualizado');
			(status);
		} catch (error) {
			message.error('Error al actualizar orden');
		} finally {
			setLoading(false);
		}
	};

	const handleOrder = () => {
		setLoading(true);
		router.push(`/dashboard/orders/update/${currentOrder.idOrderH}`);
		(currentOrder.idOrderH)
	}

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
				<div style={{display: 'flex', width: '100%'}}>
					<Title title="Información General" path="/dashboard/orders"  goBack={1} />
				</div>
				<List style={{ width: '96%', padding: '10px 30px', backgroundColor: 'rgba(128, 128, 128, 0.05)', marginBottom: '25px', borderRadius: '15px'}}>
					<ChangeOrderStatus
						status={currentOrder.idStatusOrder}
						handleOrder={handleOrder}
						orderId={id}
						handleChangeStatus={handleChangeStatus}
					/>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Numero de Orden</p>
						<p>{currentOrder.numberOrden}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Usuario - Vendedor</p>
						<p>{user?.fullname}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Estado</p>
						<p style={{color: `${getStatus()}`, fontWeight: 'bold'}}>{orderStatusToUse[currentOrder.idStatusOrder]}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Cliente</p>
						<p>{currentOrder.fullNameClient}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Numero de teléfono - Cliente</p>
						<p>{currentOrder.phoneClient}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Dirección</p>
						<p>{currentOrder.address}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Fecha de creación</p>
						<p>
							{new Date(
								currentOrder.fechaEntrega
							).toLocaleDateString()}
						</p>
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