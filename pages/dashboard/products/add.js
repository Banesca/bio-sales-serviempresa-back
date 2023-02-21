import { useProducts } from '../../../components/products/hooks/useProducts';
import ProductForm from '../../../components/products/productForm';
import DashboardLayout from '../../../components/shared/layout';
import Loading from '../../../components/shared/loading';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { message } from 'antd';

export const AddProduct = () => {

	const { loading, setLoading } = useLoadingContext();
	const { addProduct } = useProducts();

	const addProductRequest = async (data, file) => {
		setLoading(true);
		try {
			await addProduct(data, file);
			message.success('Producto agregado');
		} catch (error) {
			message.error(error?.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<DashboardLayout>
			<Loading isLoading={loading} />
			<ProductForm product={{}} handleRequest={addProductRequest} />
		</DashboardLayout>
	);
};

export default AddProduct;
