import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import PayForm from '/components/pay/PayForm';
import { useRequest } from '../../../hooks/useRequest';

const PayConditions = () => {
	const [openModal, setOpenModal] = useState(false);
	const { requestHandler } = useRequest();
	const [payConditionsList, setPayConditionsList] = useState();
	const [clients, setClients] = useState([]);
	const [message, setMessage] = useState('');

	const payConditions = () => {
		getPayConditions();
	};

	useEffect(() => {
		getPayConditions();
		getClientsRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [PayForm]);

	const getPayConditions = async () => {
		const response = await requestHandler.get('/api/v2/paymentcondition/list');
		if (!response.isLeft()) {
			const value = response.value._value.response;
			setPayConditionsList(value);
		}
	};

	const getClientsRequest = async () => {
		const res = await requestHandler.get('/api/v2/client/list');
		if (!res.isLeft()) {
			let clientsList = res.value.getValue().response;
			clientsList = clientsList.filter((b) => b.idStatusFk !== '3');
			setClients(clientsList);
		}
	};

	const getPayConditionsAdd = async () => {
		const data = {
			note: message,
		};
		const response = await requestHandler.post(
			'/api/v2/paymentcondition/add',
			data
		);
		if (!response.isLeft()) {
			const value = response.value._value.response;
			setPayConditionsList(value);
		}
		setOpenModal(false);
		getPayConditions();
		setMessage('');
	};

	const showModal = () => {
		setOpenModal(true);
	};

	const handleChange = (event) => {
		setMessage(event.target.value);
	};

	const cancelModal = (event) => {
		setOpenModal(false);
	};

	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Condiciones de pago'} goBack={false}>
					<Button className="bg-white" onClick={showModal}>
						<AppstoreAddOutlined />
						Crear
					</Button>
				</Title>
				<PayForm listConditions={payConditionsList} />
			</div>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				footer={
					<div className="flex justify-end">
						<Button danger onClick={cancelModal}>
							Cancelar
						</Button>
						<Button
							type="primary"
							className="bg-blue-500"
							onClick={getPayConditionsAdd}
						>
							Guardar
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-5">
					<h1>Ingrese el nombre o descripción</h1>
					<Form>
						<Form.Item>
							<Input
								onChange={handleChange}
								value={message}
								placeholder="Condición de pago"
							></Input>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default PayConditions;
