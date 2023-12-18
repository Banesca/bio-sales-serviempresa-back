/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ProductForm from '../../../../components/products/productForm';
import DashboardLayout from '../../../../components/shared/layout';
import { GeneralContext } from '../../../_app';
import Loading from '../../../../components/shared/loading';
import { message } from 'antd';
import { useProducts } from '../../../../components/products/hooks/useProducts';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';

export const UpdateProduct = () => {
	const generalContext = useContext(GeneralContext);

	const router = useRouter();
	const { id } = router.query;

	const { getProductById, updateProduct, currentProduct } = useProducts();

	const [product, setProduct] = useState({});
	const { loading, setLoading } = useLoadingContext();

	const getProductRequest = async (id) => {
		setLoading(true);
		try {
			await getProductById(id);
		} catch (error) {
			message.error('Error al cargar producto')
		}
	};

	console.log(currentProduct);

	const updateProductRequest = async (data, file) => {
		setLoading(true);
		try {
			await updateProduct({ ...data, idProduct: id }, file);
		} catch (error) {
			message.error('Error al actualizar producto');
		} finally {
			setLoading(false);
			/* router.push(`/dashboard/products/${id}`) */
		}
	};

	useEffect(() => {
		setLoading(true);
		if (generalContext && id) {
			getProductRequest(id);
		}
	}, [generalContext, id]);

	useEffect(() => {
		if (Object.keys(currentProduct).length) {
			setProduct(currentProduct);
			setLoading(false);
		}
	}, [currentProduct]);

	return (
		<DashboardLayout>
			{loading ? (
				<Loading isLoading={loading} />
			) : (
				<ProductForm
					product={product}
					update={true}
					handleRequest={updateProductRequest}
				/>
			)}
		</DashboardLayout>
	);
};

export default UpdateProduct;
