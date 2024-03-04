import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function UserClientsTable2({
	clients,
}) {
	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);
	//console.log(clients)
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
	];
	return (
		<Table
			style={{ width: '100%' }}
			columns={clientColumns}
			dataSource={clients}
		/>
	);
}
