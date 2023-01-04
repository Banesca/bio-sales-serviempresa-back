import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Space } from 'antd';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { profiles } from '../../pages/dashboard/users';
import { getAdmins, getFullAccess, getSellers } from '../../services/users';
import { Modal } from 'antd';
import { Input } from 'antd';

const UsersTable = ({ profile }) => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'firstName',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Apellido',
			dataIndex: 'lastName',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Correo',
			dataIndex: 'email',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Empresa',
			dataIndex: 'business',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Pedidos',
			dataIndex: 'orders',
			key: 4,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			key: 5,
			render: (_, index) => (
				<Space size="middle">
					<Button type="primary" onClick={() => handleSeeModal()}>
						<EyeTwoTone />
					</Button>
					<Button type="primary">
						<EditOutlined />
					</Button>
					<Button type="primary" danger>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	console.log('Table component', profile);

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	useEffect(() => {
		setLoading(true);
		if (profile === profiles.seller) {
			//setData(getSellers());
		} else if (profile === profiles.fullAccess) {
			//setData(getFullAccess());
		} else if (profile === profiles.admin) {
			//setData(getAdmins());
		}
		setLoading(false);
	}, [profile]);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	return (
		<div>
			<h1
				style={{ fontSize: '2rem', color: '#fff', textAlign: 'center' }}
			>
				{profile === profiles.admin
					? 'Administradores'
					: profile === profiles.seller
					? 'Vendedores'
					: 'Full acceso'}
			</h1>
			<Table columns={columns} dataSource={data} loading={loading} />
			<Modal
				title={'Detail'}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleSeeModal}
			>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</div>
	);
};

export default UsersTable;
