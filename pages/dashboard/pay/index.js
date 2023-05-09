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
