import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { List } from 'antd';
import {
	ArrowLeftOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
} from '@ant-design/icons';

import Loading from '../../../components/loading';
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
		console.log('Image', res);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		setLoading(false);
		//set(res.value.getValue().data);
	};

	const getCategoryRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/family/get/${id}`);
		console.log('Category', res);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setCategory(value);
		//set(res.value.getValue().data);
	};

	const getBrandRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/subfamily/get/${id}`);
		console.log('Brands', res);
		if (res.isLeft()) {
			return;
		}
		const value = res.value.getValue().data;
		setBrand(value);
		//set(res.value.getValue().data);
	};

	const getProductRequest = async (id) => {
		const res = await requestHandler.get(`/api/v2/product/get/${id}`);
		console.log('Product', res);
		if (res.isLeft()) {
			setLoading(false);
			return;
		}
		const value = res.value.getValue().data;
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

	useEffect(() => {
		console.log(product);
	}, [product]);

	if (loading) {
		<DashboardLayout>
			<Loading isLoading={loading} />
		</DashboardLayout>;
	}

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
				<List style={{ width: '100%', paddingInline: '2rem' }}>
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
						<p>$ {product?.priceSale}</p>
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

					{product?.isPromo == '1' && (
						<List.Item>
							<p>Precio de Promoción</p>
							<p>$ {product.marketPrice}</p>
						</List.Item>
					)}
					<List.Item>
						<p>Stock</p>
						<p>
							{product?.stock.length > 0
								? product.stock[0].stock
								: '0'}
						</p>
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
