import { useRouter } from 'next/router';
import DashboardLayout from '../../../../components/shared/layout';
import Title from '../../../../components/shared/title';
import { Button, Table } from 'antd';
import { useUser } from '../../../../components/users/hooks/useUser';
import { message } from 'antd';
import { useLoadingContext } from '../../../../hooks/useLoadingProvider';
import { useContext, useEffect, useState } from 'react';
import { GeneralContext } from '../../../_app';
import { Modal } from 'antd';
import { Form } from 'antd';
import { Input } from 'antd';
import { DatePicker } from 'antd';
import { Select } from 'antd';
import Loading from '../../../../components/shared/loading';
import { DeleteOutlined } from '@ant-design/icons';

export default function Routes() {
	const columns = [
		{
			title: 'Fecha',
			dataIndex: 'date',
			key: 1,
		},
		{
			title: 'Cliente',
			dataIndex: 'idClientFk',
			key: 2,
			render: (text) => {
				const value = sellerClients?.find((c) => c.idClient == text);
				return <p>{value?.nameClient}</p>;
			},
		},
		{
			title: 'Acciones',
			key: 3,
			width: '20px',
			render: (value) => (
				<Button
					onClick={() => showDeleteRouteConfirm(value)}
					type="primary"
					danger
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const router = useRouter();
	const { id } = router.query;
	const {
		addItemToUserRoute,
		getUserRouteByDate,
		routes,
		sellerClients,
		getSellerClients,
		removeRouteItem,
	} = useUser();
	const { loading, setLoading } = useLoadingContext();
	const generalContext = useContext(GeneralContext);

	const FORM_INITIAL_STATE = {
		idClientFk: null,
		date: '',
		observation: '',
	};

	const [formState, setFormState] = useState(FORM_INITIAL_STATE);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleAddItemToUserRoute = async (data) => {
		setLoading(true);
		try {
			await addItemToUserRoute(data);
		} catch (error) {
			message.error('Error al agregar cliente a la ruta');
		} finally {
			setLoading(false);
		}
	};

	const handleGetUserRoutes = async (data) => {
		setLoading(true);
		try {
			await getUserRouteByDate(id, data);
		} catch (error) {
			message.error('Error al cargar rutas')
		} finally {
			setLoading(false);
		}
	};

	const handleGetClients = async (id) => {
		try {
			await getSellerClients(id);
		} catch (error) {
			message.error('Error al cargar clientes')
		}
	};

	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length) {
			handleGetUserRoutes();
			handleGetClients(id);
			setLoading(false);
		}
	}, [generalContext]);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const body = {
				idUserFk: id,
				idClientFk: formState.idClientFk,
				observation: formState.observation,
				adicionalText: '',
				date: `${formState.date.$y}-${formState.date.$M + 1}-${
					formState.date.$D
				}`,
			};
			setIsModalOpen(false);
			await handleAddItemToUserRoute(body);
			await handleGetUserRoutes();
		} catch (error) {
			message.error('Ha ocurrido un error')
		} finally {
			setLoading(false);
		}
	};

	const handleFilterRoutes = async (values) => {
		if (!values) {
			return await handleGetUserRoutes();
		}
		const dateStart = `${values[0].$y}-${values[0].$M + 1}-${values[0].$D}`;
		const dateEnd = `${values[1].$y}-${values[1].$M + 1}-${values[1].$D}`;
		try {
			await handleGetUserRoutes({ dateStart, dateEnd });
		} catch (error) {
			message.error('Ha ocurrido un error')
		}
	};

	const showDeleteRouteConfirm = (value) => {
		Modal.confirm({
			title: 'Eliminar',
			content: 'Estas seguro de eliminar esta ruta?',
			okText: 'Eliminar',
			icon: null,
			cancelText: 'Cancelar',
			okButtonProps: {
				type: 'primary',
				danger: true,
			},
			onOk() {
				return new Promise((resolve, reject) => {
					removeRouteItem({
						idSellerRoute: value.idSellersRuta,
						userId: id,
					});
					resolve(message.success('Cliente removido de la ruta'));
				}).catch(() => message.error('Ha ocurrido un error'));
			},
			onCancel() {},
		});
	};

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					justifyContent: 'center',
				}}
			>
				<Title
					title="Rutas"
					path={`/dashboard/users/${id}`}
					goBack={true}
				>
					<Button type="success" onClick={() => setIsModalOpen(true)}>
						Agregar
					</Button>
				</Title>
				<Form>
					<Form.Item>
						<DatePicker.RangePicker
							placeholder={['Fecha inicial', 'Fecha final']}
							allowEmpty={[false, false]}
							onChange={handleFilterRoutes}
						></DatePicker.RangePicker>
					</Form.Item>
				</Form>
				<Table
					columns={columns}
					style={{ width: '100%' }}
					dataSource={routes}
				/>
			</div>
			<Modal
				title="Agregar Ruta"
				open={isModalOpen}
				footer={[
					<Button
						key="cancel"
						onClick={() => {
							setIsModalOpen(false);
							setFormState(FORM_INITIAL_STATE);
						}}
					>
						Cancelar
					</Button>,
					<Button key="add" type="primary" onClick={handleSubmit}>
						Agregar
					</Button>,
				]}
			>
				<Form
					labelCol={{
						lg: { span: 5 },
						sm: { span: 6 },
					}}
				>
					<Form.Item label="Cliente">
						<Select
							name="idClientFk"
							value={formState.idClientFk}
							onChange={(v) =>
								setFormState((prev) => ({
									...prev,
									idClientFk: v,
								}))
							}
						>
							{sellerClients &&
								sellerClients.map((c) => (
									<Select.Option
										key={c.idClient}
										value={c.idClient}
									>
										{c.nameClient}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item name="date" label="Fecha">
						<DatePicker
							style={{ width: '100%' }}
							value={formState.date}
							onChange={(v) =>
								setFormState((prev) => ({ ...prev, date: v }))
							}
						/>
					</Form.Item>
					<Form.Item name="observation" label="Observación">
						<Input
							value={formState.observation}
							onChange={(e) =>
								setFormState((prev) => ({
									...prev,
									observation: e.target.value,
								}))
							}
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
}
