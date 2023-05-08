import React, { useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal } from 'antd';
import PayForm from '../../../components/pay/payForm';

const PayConditions = () => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Condiciones de pago'} goBack={false}>
					<Button className="bg-white" onClick={() => setOpenModal(true)}>
						<PlusOutlined />
						Crear condición de pago
					</Button>
				</Title>
				<PayForm />
			</div>
			<Modal open={openModal} onCancel={() => setOpenModal(false)}>
				<h1>Crea una condicion de pago</h1>
				<Form>
					<Form.Item label="Condicion">
						<Input></Input>
					</Form.Item>
					<Form.Item label="Cliente">
						<Input></Input>
					</Form.Item>
				</Form>
			</Modal>
		</DashboardLayout>
	);
};

export default PayConditions;
