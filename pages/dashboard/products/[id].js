import { useEffect, useState } from 'react';
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

const Product = () => {
	const router = useRouter();
	const { id } = router.query;

	const handleReturn = () => {
		router.push('/dashboard/products');
	};

	const [product, setProduct] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		//setProduct(getProductById(id));
		setLoading(false);
	}, []);

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
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							color: 'white',
						}}
					>
						{product?.name}
					</h1>
					<div></div>
				</div>
				<List style={{ width: '600px' }}>
					<List.Item>
						<p>Código</p>
						<p>{product?.code}</p>
					</List.Item>
					<List.Item>
						<p>Precio</p>
						<p>{product?.price}</p>
					</List.Item>
					<List.Item>
						<p>Marca</p>
						<p>{product?.brand}</p>
					</List.Item>
					<List.Item>
						<p>Categoría</p>
						<p>{product?.category}</p>
					</List.Item>
					<List.Item>
						<p>Proveedor</p>
						<p>{product?.provider}</p>
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
							{product?.isOnPromotion ? (
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
				</List>
				<Image
					src={product?.image}
					height={400}
					width={400}
					alt="Producto"
				/>
			</div>
		</DashboardLayout>
	);
};

export default Product;
