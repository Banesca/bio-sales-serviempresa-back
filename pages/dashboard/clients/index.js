import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons';
import {
	Col,
	Collapse,
	Input,
	Row,
	Button,
	Space,
	Modal,
	Table,
	Form,
	ConfigProvider,
	Empty,
} from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { useRouter } from 'next/router';
import { GeneralContext } from '../../_app';
import Loading from '../../../components/shared/loading';
import { Typography } from 'antd';
import useClients from '../../../components/clients/hooks/useClients';
import { message } from 'antd';
import Title from '../../../components/shared/title';
import Link from 'next/link';

export default function ClientsPage() {
	const columns = [
		{
			title: 'Razón social',
			dataIndex: 'nameClient',
			key: 0,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Dirección',
			dataIndex: 'address',
			key: 2,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Teléfono',
			dataIndex: 'phone',
			key: 3,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 4,
			render: (_, index) => (
				<Space size="middle" style={{display: 'flex', justifyContent: 'center'}}>
					<Button
						type="primary"
						onClick={() => router.push(`clients/${index.idClient}`)}
					>
						<EyeTwoTone />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => handleOpenDeleteModal(index)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const [currentClient, setCurrentClient] = useState();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const { clients, listClients, deleteClient } = useClients();


	const handleOpenDeleteModal = (client) => {
		setCurrentClient(client);
		setDeleteModalOpen(true);
	};

	const handleCloseModal = async (bool) => {
		setLoading(true);
		if (!bool) {
			setLoading(false);
			setDeleteModalOpen(false);
			return;
		}
		setDeleteModalOpen(false);
		await handleDelete(currentClient.nameClient, currentClient.idClient);
	};

	const handleDelete = async (name, id) => {
		try {
			await deleteClient(id);
			console.log(id);
			message.success(`El usuario ${name} ha sido eliminado`);
		} catch (error) {
			message.error('Error al eliminar cliente');
		} finally {
			setLoading(false)
		}
	};




	const router = useRouter();

	const [loading, setLoading] = useState(true);
	// Modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	// clients
	// const [clients, setClients] = useState([]);

	const [query, setQuery] = useState({
		nameClient: '',
		phone: '',
		address: '',
	});

	const handleSeeModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const generalContext = useContext(GeneralContext);

	const getClientsRequest = async () => {
		setLoading(true);
		try {
			await listClients();
		} catch (error) {
			message.error('Ha ocurrido un error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (Object.keys(generalContext).length) {
			getClientsRequest();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);

	const [form] = Form.useForm();

	const onReset = () => {
		setQuery({
			fullNameClient: '',
			phoneClient: '',
			address: '',
		});
		form.resetFields();
	};

	const clientsList = useMemo(() => {
		let list = clients;
		for (const [key, value] of Object.entries(query)) {
			if (value) {
				list = list.filter((c) =>
					c[key]?.toLowerCase().includes(query[key].toLowerCase())
				);
			}
		}
		return list;
	}, [query, clients]);

	const handleSearch = (values) => {
		setQuery({
			nameClient: values.fullNameClient || '',
			phone: values.phoneClient || '',
			address: values.address || '',
		});
	};

	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>
			
		</Empty>
	);

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Title title={'Clientes'}>
					<Link href="/dashboard/clients/add">
						<Button type="success">Agregar</Button>
					</Link>
				</Title>
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Row style={{ justifyContent: 'center' }}>
							<Form
								labelCol={{ span: 8 }}
								style={{ width: '800px' }}
								form={form}
								onFinish={handleSearch}
							>
								<Row>
									<Col span={12}>
										<Form.Item
											name="fullNameClient"
											label="Razon social"
										>
											<Input type="text" />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											name="phoneClient"
											label="Teléfono"
										>
											<Input type="text" />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											name="address"
											label="Dirección"
										>
											<Input type="text" />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item name="rif" label="Rif">
											<Input type="text" />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item
											wrapperCol={{
												span: 16,
												offset: 8,
											}}
										>
											<Button onClick={onReset} block>
												Limpiar
											</Button>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											wrapperCol={{
												span: 16,
												offset: 8,
											}}
										>
											<Button
												htmlType="submit"
												type="success"
												block
											>
												Buscar
											</Button>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Row>
					</Collapse.Panel>
				</Collapse>
				<ConfigProvider renderEmpty={customizeRenderEmpty}>
					<Table columns={columns} dataSource={clientsList} />
				</ConfigProvider>
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
			<Modal
				title="Eliminar"
				open={deleteModalOpen}
				onOk={() => handleCloseModal(true)}
				onCancel={() => handleCloseModal(false)}
				footer={[
					<Button
						key="cancel"
						onClick={() => handleCloseModal(false)}
					>
							Cancelar
					</Button>,
					<Button
						key="delete"
						danger
						type="primary"
						onClick={() => handleCloseModal(true)}
					>
							Eliminar
					</Button>,
				]}
			>
				<p>
					Estas seguro de que deseas eliminar a {`${currentClient?.nameClient}`}
				</p>
			</Modal>						
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}