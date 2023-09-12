import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function UserClientsTable({
	clients,
	setClientToRemove,
	setConfirmDelete,
	handleAssignClientsToSeller,
	setIsAssignClientOpen,
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
			title: 'Fecha de visita',
			dataIndex: 'fecha',
			key: '2',

			render: (text) => <p>{text}</p>,
		},
		{
			title: (
				<Button
					className="bg-blue-500"
					disabled={log == 1 ? false : true}
					onClick={() => openAssignClient()}
					type="success"
					block
				>
					Asignar cliente
				</Button>
			),
			key: '3',
			width: 300,
		},
		{
			title: 'Acciones',
			key: '4',
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
		console.log(item);
		setClientToRemove(item);
		setConfirmDelete(true);
	};

	const openAssignClient = () => {
		setIsAssignClientOpen(true);
	};

	return (
		<Table
			style={{ width: '100%' }}
			columns={clientColumns}
			dataSource={clients}
		/>
	);
}
