import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function UserBusinessTable2({
	business,
}) {
	const [log, setLog] = useState();

	useEffect(() => {
		setLog(localStorage.getItem('userProfile'));
	}, []);

	const columns = [
		{
			title: 'Sucursales',
			dataIndex: 'nombre',
			key: '1',
			render: (text) => <p>{text}</p>,
		},
	];
	return (
		<Table columns={columns} style={{ width: '100%' }} dataSource={business} />
	);
}
