import DashboardLayout from '../../../components/shared/layout';
import { List, message } from 'antd';
import Loading from '../../../components/shared/loading';
import { useContext, useEffect } from 'react';
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

	const handleChangeStatus = async (status) => {
		setLoading(true);
		try {
			await changeStatus(status, id);
			message.success('Estado actualizado');
		} catch (error) {
			message.error('Error al actualizar orden');
		} finally {
			setLoading(false);
		}
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
				<Title title="Información General" path="/dashboard/orders" />
				<ChangeOrderStatus
					status={currentOrder.idStatusOrder}
					orderId={id}
					handleChangeStatus={handleChangeStatus}
				/>
				<List style={{ width: '100%' }}>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Numero de Orden</p>
						<p>{currentOrder.numberOrden}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Usuario - Vendedor</p>
						<p>{user.fullname}</p>
					</List.Item>
					<List.Item>
						<p style={{fontWeight: 'bold'}}>Estado</p>
						<p>{orderStatusToUse[currentOrder.idStatusOrder]}</p>
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
