import { Button, ConfigProvider, Empty, Table } from 'antd';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Space } from 'antd';
import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { orderStatusToUse } from '../../pages/dashboard/orders';
import { useRouter } from 'next/router';

export default function OrdersTable({ orders }) {
	const router = useRouter();

	const { loading, setLoading } = useLoadingContext();

	const handleSeeDetail = (order) => {
		setLoading(true);
		router.push(`/dashboard/orders/${order.idOrderH}`);
	};

	const columns = [
		{
			title: 'Fecha de creación',
			dataIndex: 'created_at',
			key: 0,
			sorter: (a, b) => {
				let aDay = a.created_at.substring(5, 7);
				let bDay = b.created_at.substring(8, 10);
				
				let aMonth = a.created_at.substring(5, 7);
				let bMonth = b.created_at.substring(5, 7);
				
				let aYear = a.created_at.substring(0, 4);
				let bYear = b.created_at.substring(0, 4);

				let aDate = new Date(aDay, aMonth, aYear);
				let bDate = new Date(aDay, aMonth, aYear);

				return aDate - bDate
			},
			showSorterTooltip: false,
			render: (text) => <p>{text.slice(0, 10).split('-').reverse().join('-')}</p>,
		},
		{
			title: 'Ultima actualización',
			dataIndex: 'updated_at',
			key: 0,
			sorter: (a, b) => {
				let aDay = a.updated_at.substring(5, 7);
				let bDay = b.updated_at.substring(8, 10);
				
				let aMonth = a.updated_at.substring(5, 7);
				let bMonth = b.updated_at.substring(5, 7);

				let aYear = a.updated_at.substring(0, 4);
				let bYear = b.updated_at.substring(0, 4);

				let aDate = new Date(aDay, aMonth, aYear);
				let bDate = new Date(bDay, bMonth, bYear);

				return aDate - bDate
			},
			showSorterTooltip: false,
			render: (text) => (
				<p>{text.slice(0, 10).split('-').reverse().join('-')}</p>),
		},
		{
			title: 'Vendedor',
			dataIndex: 'fullname',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cliente',
			dataIndex: 'fullNameClient',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
			dataIndex: 'statusOrder',
			key: 3,
			render: (text, record) => {
				switch (record.idStatusOrder) {
				case 1:
					return (
						<p style={{ color: '#ff6c0b', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 2:
					return (
						<p style={{ color: '#06a800', fontWeight: 'bold' }}> 
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 3:
					return (
						<p style={{ color: '#0984e3', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 4:
					return (
						<p style={{ color: '#ffd034', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 5:
					return (
						<p style={{ color: '#d63031', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				}
			},
		},
		{
			title: 'Acción',
			key: 5,
			render: (order, record) => (
				<Space size="middle" style={{display: 'flex', justifyContent: 'center'}}>
					{orderStatusToUse[record.idStatusOrder] == 'Facturado' 
						? <Button
							type='primary'
							onClick={() => handleSeeDetail(order)}
						>
							<EyeTwoTone/>
						</Button>
						: <Button
							onClick={() => handleSeeDetail(order)}
						>
							<EditOutlined/>
						</Button>
					}
					<Button
						type='primary'
						danger
					>
						<DeleteOutlined/>
					</Button>
				</Space>
			),
		},
	];

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
			<Table columns={columns} dataSource={orders} loading={loading} />
		</ConfigProvider>

	)
}