import { DeleteOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';

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

	return (
		<Table
			style={{ width: '100%' }}
			columns={clientColumns}
			dataSource={clients}
		/>
	);
}
