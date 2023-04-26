import { Col, Row, Button, Modal } from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import Link from 'next/link';
import OrdersFilters from '../../../components/orders/ordersFilters';
import { useOrders } from '../../../components/orders/hooks/useOrders';
import { message } from 'antd';
import OrdersTable from '../../../components/orders/ordersTable';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { Typography } from 'antd';
import Title from '../../../components/shared/title';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import PROFILES from '../../../components/shared/profiles';

export const orderStatusToUse = {
	1: { state: 'Inconcluso', color: 'orange' },
	2: { state: 'Facturado', color: 'green' },
	3: { state: 'Por facturar', color: 'blue' },
	4: { state: 'Despachado', color: 'yellow' },
	5: { state: 'Cobrado', color: 'purple' },
	6: { state: 'Anulado', color: 'red' },
};

export default function OrdersPage() {
	const { orders, getOrders } = useOrders();
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	const { userProfile } = useAuthContext();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [query, setQuery] = useState({
		idStatusOrder: 0,
		startDate: null,
		endDate: null,
	});

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const getOrdersRequest = async (data) => {
		setLoading(true);
		try {
			await getOrders(data);
		} catch (error) {
			message.error('Error al cargar los pedidos');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		if (
			Object.keys(generalContext).length &&
			Object.keys(selectedBusiness).length
		) {
			getOrdersRequest({
				idBranchFk: selectedBusiness.idSucursal,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const ordersList = useMemo(() => {
		let list = orders;
		if (query.idStatusOrder) {
			if (list) {
				list = list.filter((o) => o.idStatusOrder == query.idStatusOrder);
			}
		}
		return list;
	}, [query, orders]);

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Title title={'Pedidos'}>
					<Link href="orders/add">
						<Button type="success" style={{ marginRight: '-2.3rem' }}>
							Agregar
						</Button>
					</Link>
				</Title>
				<OrdersFilters
					setQuery={setQuery}
					getOrdersRequest={getOrdersRequest}
				/>
				<OrdersTable orders={ordersList} />
			</div>
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleSeeModal}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
