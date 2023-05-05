import {
	DeleteOutlined,
	EditOutlined,
	EyeTwoTone,
	UploadOutlined,
} from '@ant-design/icons';
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
} from 'antd';
import { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { useRouter } from 'next/router';
import { GeneralContext } from '../../_app';
import Loading from '../../../components/shared/loading';
import useClients from '../../../components/clients/hooks/useClients';
import { message } from 'antd';
import Title from '../../../components/shared/title';
import Link from 'next/link';
import { useRequest } from '../../../hooks/useRequest';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';

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
			dataIndex: 'statusName',
			key: 4,
			render: (text, index) => (
				<>
					{text == 'Eliminado' ? (
						<>
							<Space
								size="middle"
								className="w-full mx-0 my-auto flex justify-center"
							>
								<Button
									type="primary"
									onClick={() => router.push(`clients/${index.idClient}`)}
								>
									<EyeTwoTone />
								</Button>
							</Space>
							{/* <Button
								onClick={() => handleActivateModal(index)}
								className="bg-teal-400 text-white"
							>
								<UploadOutlined />
							</Button> */}
						</>
					) : (
						<>
							<Space>
								<Button
									onClick={() => router.push(`clients/update/${index.idClient}`)}
								>
									<EditOutlined />
								</Button>
								<Button
									type="primary"
									danger
									onClick={() => handleOpenDeleteModal(index)}
								>
									<DeleteOutlined />
								</Button>
							</Space>

						</>
					)}
				</>
			),
		},
	];

	const [currentClient, setCurrentClient] = useState();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const { clients, listClients, deleteClient } = useClients();
	const [activateModal, setActivateModal] = useState(false);

	const { requestHandler } = useRequest();

	const handleActivateModal = (value) => {
		setActivateModal(true);
		setCurrentClient(value);
	};

	const handleCloseActivateModal = () => {
		setActivateModal(false);
	};

	const changeStateCliente = () => {
		updateClient();
		setActivateModal(false);
	};

	const updateClient = async () => {
		setLoading(false);
		// await getClientsRequest();
		try {
			const res = await requestHandler.put('/api/v2/client/update', {
				nameClient: currentClient.nameClient,
				phone: currentClient?.phone,
				mail: null,
				numberDocument: currentClient?.numberDocument,
				address: currentClient?.address,
				idStatusFK: 1,
				idClient: currentClient?.idClient,
			});
			message.success('Estado de cliente actualizado');
		} catch (error) {
			message.error('Error al actualizar cliente');
		} finally {
			setLoading(false);
		}
	};

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
			id;
			message.success(`El usuario ${name} ha sido eliminado`);
		} catch (error) {
			message.error('Error al eliminar cliente');
		} finally {
			setLoading(false);
		}
	};

	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [query, setQuery] = useState({
		nameClient: '',
		phone: '',
		address: '',
		numberDocument: '',
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
			numberDocument: '',
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
			numberDocument: values.numberDocument || '',
		});
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
				<Title title={'Clientes'}>
					<Link href="/dashboard/clients/add">
						<Button type="success" style={{ marginRight: '-2.3rem' }}>
							Agregar
						</Button>
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
										<Form.Item name="fullNameClient" label="Razon social">
											<Input type="text" />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item name="phoneClient" label="Teléfono">
											<Input type="text" />
										</Form.Item>
									</Col>
								</Row>
								<Row>
									<Col span={12}>
										<Form.Item name="address" label="Dirección">
											<Input type="text" />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item name="numberDocument" label="Rif">
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
											<Button type="warning" onClick={onReset} block>
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
											<Button htmlType="submit" type="success" block>
												Buscar
											</Button>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</Row>
					</Collapse.Panel>
				</Collapse>
				<ConfigProvider
					renderEmpty={
						clientsList.length !== 0 || true ? CustomizeRenderEmpty : ''
					}
				>
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
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => handleCloseModal(false)}>
							Cancelar
						</Button>
						<Button
							key="delete"
							danger
							type="primary"
							onClick={() => handleCloseModal(true)}
						>
							Eliminar
						</Button>
					</div>
				]}
			>
				<p>
					Estas seguro de que deseas eliminar a {`${currentClient?.nameClient}`}
				</p>
			</Modal>
			<Modal
				title="Actualizar estado"
				open={activateModal}
				onCancel={() => handleCloseActivateModal()}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => handleCloseActivateModal()}>
							Cancelar
						</Button>
						<Button
							key="delete"
							type="primary"
							onClick={() => changeStateCliente()}
						>
							Actualizar
						</Button>
					</div>
				]}
			>
				<p>¿Deseas cambiar el estado del cliente a activo?</p>
			</Modal>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
