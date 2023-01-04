import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import { Col, Collapse, Row } from 'antd';
import { Button, Space } from 'antd';
import { Modal } from 'antd';
import { Table } from 'antd';
import { useState } from 'react';
import DashboardLayout from '../../../components/layout';
import { Form } from 'antd';
import { Select } from 'antd';
import { DatePicker } from 'antd';

export default function OrdersPage() {
	const columns = [
		{
			title: 'Numero de Orden',
			dataIndex: 'rut',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Vendedor',
			dataIndex: 'rif',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Cliente',
			dataIndex: 'rif',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Estado',
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

	const data = [];

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
						fontSize: '2rem',
						color: '#fff',
						textAlign: 'center',
					}}
				>
					Pedidos
				</h1>
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Form style={{ maxWidth: '900px' }}>
							<Row
								style={{
									justifyContent: 'space-between',
								}}
							>
								<Col span={12}>
									<Form.Item
										label="Empresa"
										style={{
											padding: '0 .5rem',
										}}
									>
										<Select
											allowClear
											placeholder="Empresa"
										></Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Fecha"
										style={{
											padding: '0 .5rem',
										}}
									>
										<DatePicker.RangePicker></DatePicker.RangePicker>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item>
								<Button htmlType="submit" type="primary">
									Buscar
								</Button>
							</Form.Item>
						</Form>
					</Collapse.Panel>
				</Collapse>
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
