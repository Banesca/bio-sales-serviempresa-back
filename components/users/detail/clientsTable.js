import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Empty, Table } from 'antd';

export default function UserClientsTable({
	clients,
	setClientToRemove,
	setConfirmDelete,
}) {
	const clientColumns = [
		{
			title: 'Clientes',
			dataIndex: 'nameClient',
			key: '1',
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			key: '2',
			width: 20,
			render: (item) => (
				<Button
					type="primary"
					danger
					onClick={() => openConfirmDelete(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const openConfirmDelete = (item) => {
		setClientToRemove(item);
		setConfirmDelete(true);
	};

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
				columns={clientColumns}
				dataSource={clients}
			/>
		</ConfigProvider>

	);
}
