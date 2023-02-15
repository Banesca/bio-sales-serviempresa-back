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
import useClients from '../../../../components/clients/hooks/useClients';

export default function Routes() {
	const columns = [
		{
			title: 'Fecha',
		},
		{
			title: 'Clientes',
		},
	];

	const router = useRouter();
	const { id } = router.query;
	const { addItemToUserRoute, getUserRouteByDate } = useUser();
	const { loading, setLoading } = useLoadingContext();
	const { listClients, clients } = useClients();
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
			console.log(error);
			message.error('Error al agregar cliente a la ruta');
		} finally {
			setLoading(false);
		}
	};

	const handleGetUserRoutes = async (data) => {
		setLoading(true);
		try {
			await getUserRouteByDate(data, id);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleGetClients = async () => {
		try {
			await listClients();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setLoading(true);
		if (Object.keys(generalContext).length) {
			handleGetUserRoutes();
			handleGetClients();
			setLoading(false);
		}
	}, [generalContext]);

	const handleSubmit = async () => {
		setLoading(true);
		try {
			console.log(formState);
			const body = {
				idUserFk: id,
				idClientFk: formState.idClientFk,
				observation: formState.observation,
				adicionalText: '',
				date: `${formState.date.$y}-${formState.date.$M + 1}-${
					formState.date.$D
				}`,
			};
			console.log(body);
			setIsModalOpen(false);
			await handleAddItemToUserRoute(body);
			await handleGetUserRoutes();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
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
				<Title title="Rutas" path={`/dashboard/users/${id}`}>
					<Button type="primary" onClick={() => setIsModalOpen(true)}>
						Agregar
					</Button>
				</Title>
				<Table columns={columns} style={{ width: '100%' }} />
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
							{clients &&
								clients.map((c) => (
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
									...formState,
									observation: e.target.value,
								}))
							}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</DashboardLayout>
	);
}
