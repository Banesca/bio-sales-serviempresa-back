import { Col, ConfigProvider, Empty, Row, Typography } from 'antd';
import { Table } from 'antd';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { addKeys } from '../../../util/setKeys';

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
			render: (quantity, record) => (
				<p>$ {record.priceSale * quantity}</p>
			),
		},
	];

	const { loading } = useLoadingContext();
	addKeys(products)

	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>
			
		</Empty>
	);

	return (
		<ConfigProvider renderEmpty={customizeRenderEmpty}>
			<Table
				style={{ width: '100%' }}
				columns={columns}
				dataSource={products}
				loading={loading}
				title={() => (
					<Typography
						style={{
							fontSize: '1.5rem',
							fontWeight: 'bold',
						}}
					>
						Productos
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
