import { Button, Modal } from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import Link from 'next/link';
import OrdersFilters from '../../../components/orders/ordersFilters';
import { useOrders } from '../../../components/orders/hooks/useOrders';
import { message } from 'antd';
import OrdersTable from '../../../components/orders/ordersTable';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import Title from '../../../components/shared/title';
import {
	AppstoreAddOutlined
} from '@ant-design/icons';

export const orderStatusToUse = {
	1: { state: 'Por facturar', color: 'orange' },
	2: { state: 'Cobrado', color: 'green' },
	3: { state: 'Facturado', color: 'blue' },
	4: { state: 'Despachado', color: 'yellow' },
	5: { state: 'Anulado', color: 'purple' },
	6: { state: 'Incompleto', color: 'red' },
};

export default function OrdersPage() {
	const { orders, getOrders } = useOrders();
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();
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
			<div className="m-4 p-4">
				<Title title={'Pedidos'}>
					<Link href="orders/add">
						<Button type="success" style={{ marginRight: '-2.3rem' }}>
							<AppstoreAddOutlined/> Crear
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
