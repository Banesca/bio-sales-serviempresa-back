import { Button, Table } from 'antd';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Space } from 'antd';
import { EyeTwoTone } from '@ant-design/icons';
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
				let aYear = a.created_at.substring(0, 4);
				let bYear = b.created_at.substring(0, 4);

				let aMonth = a.created_at.substring(5, 7);
				let bMonth = b.created_at.substring(5, 7);

				let aDay = a.created_at.substring(5, 7);
				let bDay = b.created_at.substring(8, 10);

				let aDate = new Date(aYear, aMonth, aDay);
				let bDate = new Date(bYear, bMonth, bDay);

				return aDate - bDate
			},
			showSorterTooltip: false,
			render: (text) => <p>{text.split(' ', 1)}</p>,
		},
		{
			title: 'Ultima actualización',
			dataIndex: 'updated_at',
			key: 0,
			sorter: (a, b) => {
				let aYear = a.updated_at.substring(0, 4);
				let bYear = b.updated_at.substring(0, 4);

				let aMonth = a.updated_at.substring(5, 7);
				let bMonth = b.updated_at.substring(5, 7);

				let aDay = a.updated_at.substring(5, 7);
				let bDay = b.updated_at.substring(8, 10);

				let aDate = new Date(aYear, aMonth, aDay);
				let bDate = new Date(bYear, bMonth, bDay);

				return aDate - bDate
			},
			showSorterTooltip: false,
			render: (text) => <p>{text.split(' ', 1)}</p>,
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
						<p style={{ color: '#0984e3', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				case 2:
					return (
						<p style={{ color: '#00b894', fontWeight: 'bold' }}>
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
						<p style={{ color: '#d63031', fontWeight: 'bold' }}>
							{orderStatusToUse[record.idStatusOrder]}
						</p>
					);
				}
			},
		},
		{
			title: 'Acciones',
			key: 5,
			render: (order) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => handleSeeDetail(order)}
					>
						<EyeTwoTone />
					</Button>
				</Space>
			),
		},
	];

	return <Table columns={columns} dataSource={orders} loading={loading} />;
}
