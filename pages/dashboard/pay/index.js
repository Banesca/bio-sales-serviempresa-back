import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table } from 'antd';
import PayForm from '../../../components/pay/payForm';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';

const PayConditions = () => {
	const [openModal, setOpenModal] = useState(false);
	const { requestHandler } = useRequest();
	const [payConditionsList, setPayConditionsList] = useState();

	const payConditions = () => {
		getPayConditions();
	}

	useEffect(() => {
		console.log(payConditionsList);
		getPayConditions();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [PayForm])
	

	const getPayConditions = async () => {
		const response = await requestHandler.get(
			'/api/v2/paymentcondition/list'
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		const value = response.value._value.response;
		console.log(value);
		setPayConditionsList(value);
	};
	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Condiciones de pago'} goBack={false}>
					<Button className="bg-white" onClick={() => payConditions()}>
						<PlusOutlined />
						Crear condición de pago
					</Button>
				</Title>
				<PayForm listConditions={payConditionsList} />
			</div>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				footer={
					<div className="flex justify-end">
						<Button danger>Cancelar</Button>
						<Button type="primary" className="bg-blue-500">
							Guardar
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-5">
					<h1>Crea una condicion de pago</h1>
					<Form>
						<Form.Item label="Condicion">
							<Input></Input>
						</Form.Item>
						<Form.Item label="Cliente">
							<Input></Input>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default PayConditions;
