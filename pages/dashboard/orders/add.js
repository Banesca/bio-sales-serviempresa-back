import DashboardLayout from '../../../components/shared/layout';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';
import AddOrderForm from '../../../components/orders/addOrderForm';
import { useRouter } from 'next/router';
import PayForm from '../../../components/pay/PayForm';
export const AddOrder = () => {
	const { requestHandler } = useRequest();
	const router = useRouter();

	const addOrderRequest = async (data) => {
		const res = await requestHandler.post('/api/v2/order/create', data);
		if (res.isLeft()) {
			return message.error('Ha ocurrido un error');
		}
		const value = res.value.getValue().data;
		message.success('Pedido agregado');
		router.push(`/dashboard/orders/update/${value[0]}`);
	};

	return (
		<DashboardLayout>
			<AddOrderForm handleRequest={addOrderRequest} />
			<PayForm/>
		</DashboardLayout>
	);
};

export default AddOrder;
