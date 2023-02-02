import DashboardLayout from '../../../components/shared/layout';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';
import AddOrderForm from '../../../components/orders/addOrderForm';
import { useRouter } from 'next/router';

export const AddOrder = () => {
	const { requestHandler } = useRequest();
	const router = useRouter();

	const addOrderRequest = async (data) => {
		const res = await requestHandler.post('/api/v2/order/create', data);
		console.log('RESPONSE', res);
		if (res.isLeft()) {
			console.log(res.value.getErrorValue());
			message.error('Ha ocurrido un error');
			return;
		}
		const value = res.value.getValue().data;
		console.log(value);
		message.success('Pedido agregado');
		router.push(`/dashboard/orders/update/${value[0]}`);
	};

	return (
		<DashboardLayout>
			<AddOrderForm handleRequest={addOrderRequest} />
		</DashboardLayout>
	);
};

export default AddOrder;
