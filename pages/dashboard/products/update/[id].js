import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ProductForm from '../../../../components/products/productForm';
import DashboardLayout from '../../../../components/layout';
import { GeneralContext } from '../../../_app';
import Loading from '../../../../components/loading';
import { useRequest } from '../../../../hooks/useRequest';
import { message } from 'antd';

export const UpdateProduct = () => {
	const generalContext = useContext(GeneralContext);

	const router = useRouter();
	const { id } = router.query;

	const [product, setProduct] = useState({});
	const [productImage, setProductImage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [brand, setBrand] = useState(null);
	const [category, setCategory] = useState(null);

	const { requestHandler } = useRequest();

	const getCategoryRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/family/get/${id}`);
		if (res.isLeft()) {
			return console.log('error');
		}
		const value = res.value.getValue().data;
		setCategory(value);
		//set(res.value.getValue().data);
	};

	const getBrandRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/subfamily/get/${id}`);
		if (res.isLeft()) {
			setLoading(false);
			return console.log('error');
		}
		const value = res.value.getValue().data;
		setBrand(value);
		setLoading(false);
		//set(res.value.getValue().data);
	};

	const getProductRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/product/get/${id}`);
		if (res.isLeft()) {
			setLoading(false);
			return console.log('ERROR', res.value.getErrorValue());
		}
		const value = res.value.getValue().data;
		console.log('PRODUCT', value);
		setProduct(value);
		getCategoryRequest(value.idProductFamilyFk);
		getBrandRequest(value.idProductSubFamilyFk);
		//getImageRequest(res.value.getValue().data.urlImagenProduct);
	};

	const updateProductRequest = async (data) => {
		const res = await requestHandler.put('/api/v2/product/update', data);
		console.log('RESPONSE', res);
		if (res.isLeft()) {
			console.log(res.value.getErrorValue());
			message.error('Ha ocurrido un error');
			setLoading(false);
			return;
		}
		setLoading(false);
		const value = res.value.getValue().response;
		console.log(value);
		message.success('Producto Actualizado');
	};

	useEffect(() => {
		if (generalContext && id) {
			setLoading(true);
			getProductRequest(id);
		}
	}, [generalContext, id]);

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
