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
			render: (text) => <p>{text.split(' ', 1)}</p>,
		},
		{
			title: 'Ultima actualización',
			//dataIndex: 'updated_at',
			key: 0,
			render: (text) => <p></p>,
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
							<p style={{ color: '#0984e3' }}>
								{orderStatusToUse[record.idStatusOrder]}
							</p>
						);
					case 2:
						return (
							<p style={{ color: '#00b894' }}>
								{orderStatusToUse[record.idStatusOrder]}
							</p>
						);
					case 3:
						return (
							<p style={{ color: '#0984e3' }}>
								{orderStatusToUse[record.idStatusOrder]}
							</p>
						);
					case 4:
						return (
							<p style={{ color: '#d63031' }}>
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
