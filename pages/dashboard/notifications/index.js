import React, { useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import NotificationsCards from '../../../components/notifications/NotificationsCards';
import Title from '../../../components/shared/title';
import { Button, Form, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const Notifications = () => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<>
			<DashboardLayout>
				<div className="p-4 m-4">
					<Title title={'Notificaciones'} goBack={false}>
						<Button className="bg-white" onClick={() => setOpenModal(true)}>
							<PlusOutlined />
							Crear notificaciones
						</Button>
					</Title>
					<NotificationsCards />
				</div>
				<Modal open={openModal} onCancel={() => setOpenModal(false)}>
					<h1>Crea una notificación</h1>
					<Form>
						<Form.Item label="Titulo">
							<Input></Input>
						</Form.Item>
						<Form.Item label="Cuerpo">
							<Input></Input>
						</Form.Item>
						<Form.Item label="Simbolo">
							<Input></Input>
						</Form.Item>
					</Form>
				</Modal>
			</DashboardLayout>
		</>
	);
};

export default Notifications;
