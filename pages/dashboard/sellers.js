import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import { Button, Space } from 'antd';
import { Modal } from 'antd';
import { Table } from 'antd';
import { useState } from 'react';
import DashboardLayout from '../../components/layout';

export default function Sellers() {
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

	const data = [
		{
			key: 1,
			firstName: 'Andre',
			lastName: 'Izarra',
			email: 'aizarra2015@gmail.com',
			business: 'Innova',
			orders: 52,
		},
	];

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
				}}
			>
				<h1 style={{ fontSize: '2rem' }}>Vendedores</h1>
				<Input.Search
					placeholder="Buscar vendedor"
					style={{ maxWidth: '400px', marginBottom: '1rem' }}
				/>
			</div>
			<Table columns={columns} dataSource={data} />
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
		</DashboardLayout>
	);
}
