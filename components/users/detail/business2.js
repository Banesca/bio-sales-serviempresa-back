import { DeleteOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Table } from 'antd';
import { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../common/customizeRenderEmpty';

export default function UserBusinessTable2({
	business,
	setConfirmDelete,
	setBusinessToRemove,
	setIsModalOpen,
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
		{
			title: 'Acciones',
			key: '3',
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
		setBusinessToRemove(item);
		setConfirmDelete(true);
	};
	const openAssignBusiness = () => {
		setIsModalOpen(true);
	};

	return (
		<Table columns={columns} style={{ width: '100%' }} dataSource={business} />
	);
}
