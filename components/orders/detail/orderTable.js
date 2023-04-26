import { Col, ConfigProvider, Row, Typography } from 'antd';
import { Table } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { addKeys } from '../../../util/setKeys';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function DetailOrderTable({ products, total }) {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'barCode',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Precio',
			dataIndex: 'priceSale',
			key: 1,
			render: (text) => <p>$ {text}</p>,
		},
		{
			title: 'Cantidad',
			dataIndex: 'weight',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Sub Total',
			dataIndex: 'weight',
			key: 3,
			render: (quantity, record) => <p>$ {record.priceSale * quantity}</p>,
		},
	];

	const { loading } = useLoadingContext();
	addKeys(products);

	return (
		<ConfigProvider
			renderEmpty={products.length !== 0 ? CustomizeRenderEmpty : ''}
		>
			<Table
				style={{ width: '100%' }}
				columns={columns}
				dataSource={products}
				loading={loading}
				title={() => (
					<Typography
						style={{
							fontSize: '2rem',
							fontWeight: 'bold',
							textAlign: 'center',
						}}
					>
						Pedidos
					</Typography>
				)}
				footer={() => (
					<Row>
						<Col span={12}>
							<Typography
								style={{
									fontSize: '1.2rem',
									fontWeight: 'bold',
								}}
							>
								Total
							</Typography>
						</Col>
						<Col span={12}>
							<Typography
								style={{
									textAlign: 'end',
									fontSize: '1.2rem',
									fontWeight: 'bold',
									marginRight: '2rem',
								}}
							>
								$ {total}
							</Typography>
						</Col>
					</Row>
				)}
			/>
		</ConfigProvider>
	);
}
