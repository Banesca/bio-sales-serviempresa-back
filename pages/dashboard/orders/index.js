import { Button, Modal } from 'antd';
import { Col, Form, Row,Select } from 'antd';
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
import { Tab, Tabs } from '@mui/material';


export const orderStatusToUse = {
	1: { state: 'Por pagar', color: 'orange' },
	2: { state: 'Cobrado', color: 'green' },
	3: { state: 'Pagado', color: 'blue' },
	4: { state: 'Despachado', color: 'yellow' },
	5: { state: 'Anulado', color: 'red' },
	6: { state: 'Anulado', color: 'red' },
};

export default function OrdersPage() {
	const { orders, getOrders } = useOrders();
	const [stateOrder,setStateOrder] = useState(3);
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();
	const { selectedBusiness } = useBusinessProvider();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [query, setQuery] = useState({
		idStatusOrder: 0,
		startDate: null,
		endDate: null,
		fullNameClient:null,
		fullname:null,
		numberOrden:null,
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
			message.error('Error al cargar las ordenes');
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
		const result = orders.filter((order) => order.idStatusOrder === stateOrder);

		let list = result;
		if (query.idStatusOrder) {
			if (list) {
				list = list.filter((o) => o.idStatusOrder == query.idStatusOrder);
			}
		}
		if (query.fullNameClient) {
			if (list) {
				list = list.filter((o) => o.fullNameClient == query.fullNameClient);
			}
		}
		if (query.fullname) {
			if (list) {
				list = list.filter((o) => o.fullname == query.fullname);
			}
		}
		if (query.numberOrden) {
			if (list) {
				list = list.filter((o) => o.numberOrden == query.numberOrden);
			}
		}
		return list;
	}, [query, orders]);

useEffect(()=>{ },[stateOrder,ordersList])
	
	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Órdenes'}>
				<Form.Item
								label="Estado"
								name="idStatusOrder"
								style={{
									paddingRight: '1rem',
									width:'25%'
								}}
							>
								<Select value={stateOrder}
							onChange={(value) =>
								setStateOrder((prev) => ({
									...prev,
									stateOrder: value,
								}))
							}>
									{Object.entries(orderStatusToUse).map((o) => {
										return (
											<Select.Option key={o[0]} value={o[0]}>
												{o[1].state}
											</Select.Option>
										);
									})}
								</Select>
							</Form.Item>
					<Link href="orders/add">
					<Button type="success" style={{ marginRight: '-2.6rem' }}>
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
