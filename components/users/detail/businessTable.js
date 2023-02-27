import { DeleteOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';

export default function UserBusinessTable({
	business,
	setConfirmDelete,
	setBusinessToRemove,
}) {
	const columns = [
		{
			title: 'Empresas',
			dataIndex: 'nombre',
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
		setBusinessToRemove(item);
		setConfirmDelete(true);
	};

	return (
		<Table
			columns={columns}
			style={{ width: '100%' }}
			dataSource={business}
		/>
	);
}
