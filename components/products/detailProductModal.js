import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Icon from '@ant-design/icons/lib/components/Icon';
import { List } from 'antd';
import { Col, Grid, Row } from 'antd';

const DetailProductModal = ({ product }) => {
	return (
		<>
			<h1 style={{ textAlign: 'center' }}>Detalle</h1>
			<List>
				<List.Item>
					<p>Nombre</p>
					<p>{product.name}</p>
				</List.Item>
				<List.Item>
					<p>Codigo</p>
					<p>{product.code}</p>
				</List.Item>
				<List.Item>
					<p>Precio</p>
					<p>{product.price}</p>
				</List.Item>
				<List.Item>
					<p>Marca</p>
					<p>{product.brand}</p>
				</List.Item>
				<List.Item>
					<p>Categoria</p>
					<p>{product.category}</p>
				</List.Item>
				<List.Item>
					<p>Proveedor</p>
					<p>{product.provider}</p>
				</List.Item>
				<List.Item>
					<p>En Promocion</p>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							height: '100%',
						}}
					>
						{product.isOnPromotion ? (
							<CheckCircleOutlined
								style={{ fontSize: '1.5rem', color: 'green' }}
							/>
						) : (
							<CloseCircleOutlined
								style={{ fontSize: '1.5rem', color: 'red' }}
							/>
						)}
					</div>
				</List.Item>

				{product.isOnPromotion && (
					<List.Item>
						<p>Precio de Promoción</p>
						<p>{product.promotionPrice}</p>
					</List.Item>
				)}
				<List.Item>
					<p>Stock</p>
					<p>{product.stock}</p>
				</List.Item>
			</List>
		</>
	);
};

export default DetailProductModal;
