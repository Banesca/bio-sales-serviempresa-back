import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { Button, List } from 'antd';
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';

import Loading from '../../../components/loading';
import { getProductById } from '../../../services/products';
import DashboardLayout from '../../../components/layout';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { ip } from '../../../util/environment';

const Product = () => {
	const generalContext = useContext(GeneralContext);

	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/products');
	};

	const [product, setProduct] = useState(null);
	const [productImage, setProductImage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [brand, setBrand] = useState(null);
	const [category, setCategory] = useState(null);

	const { requestHandler } = useRequest();

	const getImageRequest = async (image) => {
		const res = await requestHandler.get(`/product/${image}`);
		if (res.isLeft()) {
			setLoading(false);
			return console.log('error');
		}
		console.log(res.value.getValue());
		setLoading(false);
		//set(res.value.getValue().data);
	};

	const getCategoryRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/family/get/${id}`);
		if (res.isLeft()) {
			return console.log('error');
		}
		const value = res.value.getValue().data;
		console.log('Category', value);
		setCategory(value);
		//set(res.value.getValue().data);
	};

	const getBrandRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/subfamily/get/${id}`);
		if (res.isLeft()) {
			return console.log('error');
		}
		const value = res.value.getValue().data;
		console.log('Brand', value);
		setBrand(value);
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
		getImageRequest(res.value.getValue().data.urlImagenProduct);
	};

	useEffect(() => {
		if (generalContext) {
			setLoading(true);
			getProductRequest(id);
		}
	}, [generalContext]);

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<ArrowLeftOutlined
						style={{ fontSize: '1.5rem', color: 'white' }}
						onClick={handleReturn}
					/>
					<h1 style={{ color: 'white', fontSize: '2rem' }}>
						Detalles
					</h1>
					<div></div>
				</div>
				<List style={{ width: '500px' }} bordered>
					<List.Item>
						<p>Nombre</p>
						<p>{product?.nameProduct}</p>
					</List.Item>
					<List.Item>
						<p>Código</p>
						<p>{product?.barCode}</p>
					</List.Item>
					<List.Item>
						<p>Precio</p>
						<p>{product?.priceSale}</p>
					</List.Item>
					<List.Item>
						<p>Categoría</p>
						<p>{category?.name}</p>
					</List.Item>
					<List.Item>
						<p>Marca</p>
						<p>{brand?.nameSubFamily}</p>
					</List.Item>
					<List.Item>
						<p>En Promoción</p>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								height: '100%',
							}}
						>
							{product?.isPromo != 0 ? (
								<CheckCircleOutlined
									style={{
										fontSize: '1.5rem',
										color: 'green',
									}}
								/>
							) : (
								<CloseCircleOutlined
									style={{ fontSize: '1.5rem', color: 'red' }}
								/>
							)}
						</div>
					</List.Item>

					{product?.isOnPromotion && (
						<List.Item>
							<p>Precio de Promoción</p>
							<p>{product?.promotionPrice}</p>
						</List.Item>
					)}
					<List.Item>
						<p>Stock</p>
						<p>{product?.stock}</p>
					</List.Item>
					<List.Item
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{product && (
							<Image
								src={`${ip}:${generalContext?.api_port}/product/${product?.urlImagenProduct}`}
								height={300}
								width={300}
								alt="Producto"
							/>
						)}
					</List.Item>
				</List>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default Product;
