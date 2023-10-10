import { Modal } from 'antd';
import { Button, Space } from 'antd';
import { List } from 'antd';
import { useState } from 'react';
import { orderStatusToUse } from '../../../pages/dashboard/orders';
import {
	AppstoreAddOutlined,
	CloseCircleOutlined,
	AuditOutlined,
	CarryOutOutlined,
	CreditCardOutlined,
	PrinterOutlined
} from '@ant-design/icons';

export const statusNames = {
	'Por pagar': 1,
	Cobrado: 2,
	Pagado: 3,
	Despachado: 4,
	Anulado: 5,
	Eliminado: 6,
};

export default function ChangeOrderStatus({
	status,
	orderId,
	handleChangeStatus,
	handleOrder,
}) {
	const initialModalState = {
		visible: false,
		action: '',
		status: 0,
	};

	const [modal, setModal] = useState(initialModalState);

	const actions = {
		1: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames['Por pagar']].state,
				status: statusNames['Por pagar'],
			}));
		},
		2: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Cobrado].state,
				status: statusNames.Cobrado,
			}));
		},
		3: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Pagado].state,
				status: statusNames.Pagado,
			}));
		},
		4: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Despachado].state,
				status: statusNames.Despachado,
			}));
		},
		5: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Anulado].state,
				status: statusNames.Anulado,
			}));
		},
		6: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Eliminado].state,
				status: statusNames.Eliminado,
			}));
		},
	};

	const handleOpenModal = (status) => {
		actions[status]();
	};

	const handleCloseModal = () => {
		setModal(initialModalState);
	};

	const perfil = async () => {};
	perfil();

	return (
		<>
			{status != 2 && (
					<List.Item  style={{ width: '100%' }}>
						<h3 className="font-bold">Actualizar Estado</h3>
						<Space>
							{status == 1 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										<CloseCircleOutlined/> Anular pedido
									</Button>
									{/* <Button onClick={() => handleOrder()} type="info">
										Facturar
									</Button> */}
									<Button
										onClick={() => handleOpenModal(statusNames.Pagado)}
										type="primary"
										className="bg-blue-500"
									>
										<PrinterOutlined /> Facturar
									</Button>
								</>
							)}
							{status == 3 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										<CloseCircleOutlined/>  Anular pedido
									</Button>
									{/* <Button
										onClick={() => handleOpenModal(statusNames.Retenido)}
										type="primary"
										danger
									>
										Retener
									</Button> */}
									<Button
										onClick={() => handleOpenModal(statusNames.Despachado)}
										type="warning"
									>
										<CarryOutOutlined /> Despachar
									</Button>
								</>
							)}
							{status == 4 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										<CloseCircleOutlined/>  Anular pedido
									</Button>
									<Button
										onClick={() => handleOpenModal(statusNames.Cobrado)}
										type="success"
									>
										<CreditCardOutlined/> Cobrar
									</Button>
								</>
							)}
							{status == 5 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										<CloseCircleOutlined/>  Anular pedido
									</Button>
									<Button
										onClick={() => handleOpenModal(statusNames['Procesado'])}
										type="warning"
									>
									<AuditOutlined />	Procesar
									</Button>
								</>
							)}
							{status == 6 && <></>}
						</Space>
					</List.Item>
			)}
			<Modal
				open={modal.visible}
				title="Confirmación"
				onCancel={handleCloseModal}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button danger key="cancel" onClick={handleCloseModal}>
							Cancelar
						</Button>
						<Button key="submit" primary onClick={() => handleChangeStatus(modal.status)}>
							Aceptar
						</Button>
					</div>
				]}
			
			
			>
				<p>{`¿Seguro de marcar este pédido como '${modal.action}'?`}</p>
			</Modal>
		</>
	);
}
