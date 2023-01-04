import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import { Button, Space } from 'antd';
import { Modal } from 'antd';
import { Table } from 'antd';
import { useState } from 'react';
import DashboardLayout from '../../../components/layout';
import { Form } from 'antd';

export default function ClientsPage() {
	const columns = [
		{
			title: 'Razón social',
			dataIndex: 'rut',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Rif',
			dataIndex: 'rif',
			key: 1,
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
			id: 1,
			rut: 'Hermanos Perez CA',
			rif: 'V-26986902-0',
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
					flexDirection: 'column',
				}}
			>
				<h1
					style={{
						textAlign: 'center',
						fontSize: '2rem',
						color: '#fff',
					}}
				>
					Clientes
				</h1>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Form
						labelCol={{ span: '4' }}
						style={{ width: '600px' }}
					>
						<Form.Item name="rut" label="Razon social">
							<Input.Search />
						</Form.Item>
						<Form.Item name="rif" label="Rif">
							<Input.Search />
						</Form.Item>
					</Form>
				</div>
				<Table columns={columns} dataSource={data} />
			</div>
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
