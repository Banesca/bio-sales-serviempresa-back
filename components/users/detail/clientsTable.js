import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function UserClientsTable({
	clients,
	setClientToRemove,
	setConfirmDelete,
}) {
	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);

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
					disabled={log == 1 ? false : true}
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
		<ConfigProvider
			renderEmpty={clients.length !== 0 ? CustomizeRenderEmpty : ''}
		>
			<Table
				style={{ width: '100%' }}
				columns={clientColumns}
				dataSource={clients}
			/>
		</ConfigProvider>
	);
}
