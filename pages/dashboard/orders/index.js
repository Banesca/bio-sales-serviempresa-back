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

export const orderStatusToUse = {
	1: 'Recibido',
	2: 'Facturado',
	3: 'En Proceso',
	4: 'Retenido',
};

export default function OrdersPage() {
	const { orders, getOrders } = useOrders();
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();

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
			console.log(error);
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

	// filters
	const ordersList = useMemo(() => {
		let list = orders;
		if (query.idStatusOrder) {
			if (list) {
				list = list.filter(
					(o) => o.idStatusOrder == query.idStatusOrder
				);
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
				<Row style={{ alignItems: 'center' }}>
					<Col offset={6} span={12}>
						<h1
							style={{
								textAlign: 'center',
								fontSize: '2rem',
								color: '#fff',
							}}
						>
							Pedidos
						</h1>
					</Col>
					<Col
						span={6}
						style={{
							justifyContent: 'center',
							display: 'flex',
						}}
					>
						<Button type="primary">
							<Link href="orders/add">Agregar</Link>
						</Button>
					</Col>
				</Row>
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
