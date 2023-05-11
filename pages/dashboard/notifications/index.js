import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import NotificationsCards from '../../../components/notifications/NotificationsCards';
import Title from '../../../components/shared/title';
import { Button, Form, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import Loading from '../../../components/shared/loading';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';

const Notifications = () => {
	const [openModal, setOpenModal] = useState(false);
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();
	const [notification, setNotification] = useState({});
	const [form] = Form.useForm();
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();

	const sendNotification = async (businessId, notification) => {
		const response = await requestHandler.post(
			'/api/v2/utils/notification/add',
			{
				title: notification.title,
				descripcion: notification.body,
				idsucursal: businessId,
			}
		);
		if (response.isLeft()) {
			throw response.value.getErrorValue();
		}
		getNotification();
	};

	const onFinish = (values) => {
		sendNotification(selectedBusiness.idSucursal, values);
		form.resetFields();
	};

	const getNotification = async (businessId) => {
		try {
			const response = await requestHandler.get(
				`/api/v2/utils/notification/all/${selectedBusiness.idSucursal}`
			);
			if (response.isLeft()) {
				throw response.value.getErrorValue();
			}
			const value = response.value.getValue().sucursales;
			setNotification(value);
			setLoading(false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setLoading(true);
		getNotification(selectedBusiness.idSucursal);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext]);
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
					<NotificationsCards notification={notification} />
				</div>
				<Modal
					open={openModal}
					onCancel={() => setOpenModal(false)}
					footer={<></>}
				>
					<div className="flex flex-col gap-5">
						<h1 className="font-semibold">Crea una notificación</h1>
						<Form
							name="basic"
							onFinish={onFinish}
							autoSave="off"
							form={form}
							autoComplete="off"
						>
							<Form.Item
								label="Titulo"
								name="title"
								rules={[{ required: true, message: 'Ingresa un titulo' }]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Cuerpo"
								name="body"
								rules={[{ required: true, message: 'Ingresa una descripción' }]}
							>
								<Input />
							</Form.Item>
							<div className="flex gap-5 justify-end">
								<Form.Item className="my-auto">
									<Button danger onClick={() => setOpenModal(false)}>
										Cancelar
									</Button>
								</Form.Item>
								<Form.Item className="my-auto">
									<Button
										type="primary"
										className="bg-blue-500"
										htmlType="submit"
									>
										Aceptar
									</Button>
								</Form.Item>
							</div>
						</Form>
					</div>
				</Modal>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default Notifications;
