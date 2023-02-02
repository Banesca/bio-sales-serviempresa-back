import ProductForm from '../../../components/products/productForm';
import DashboardLayout from '../../../components/shared/layout';
import { useRequest } from '../../../hooks/useRequest';
import { message } from 'antd';

export const AddProduct = () => {
	const { requestHandler } = useRequest();

	const addProductRequest = async (data) => {
		const res = await requestHandler.post('/api/v2/product/add', data);
		console.log('RESPONSE', res);
		if (res.isLeft()) {
			console.log(res.value.getErrorValue());
			message.error('Ha ocurrido un error');
			//setLoading(false);
			return;
		}
		//setLoading(false);
		const value = res.value.getValue().response;
		console.log(value);
		message.success('Producto Agregado');
	};

	return (
		<DashboardLayout>
			<ProductForm product={{}} handleRequest={addProductRequest} />
		</DashboardLayout>
	);
};

export default AddProduct;
