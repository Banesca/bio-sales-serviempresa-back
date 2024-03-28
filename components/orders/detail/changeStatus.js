import { Modal, message } from 'antd';
import { Button, Space } from 'antd';
import { List } from 'antd';
import { useState } from 'react';
import { useRequest } from '../../../hooks/useRequest';
import { orderStatusToUse } from '../../../pages/dashboard/orders';
import {
	AppstoreAddOutlined,
	CloseCircleOutlined,
	AuditOutlined,
	CarryOutOutlined,
	CreditCardOutlined,
	PrinterOutlined,
} from '@ant-design/icons';

export const statusNames = {
	'Por pagar': 1,
	Cobrado: 2,
	Pagado: 3,
	Despachado: 4,
	Anulado: 5,
	Eliminado: 6,
	'Por facturar': 7,
};

export default function ChangeOrderStatus({
	status,
	orderId,
	handleChangeStatus,
	handleOrder,
	bodyRegisterAnul,
	attributes,
	currentOrder
}) {
	const initialModalState = {
		visible: false,
		action: '',
		status: 0,
	};
	const { requestHandler } = useRequest();
	const [modal, setModal] = useState(initialModalState);

	const handleAnul = async (bodyRegisterAnul,attributes,currentOrder) => {

		Object.keys(attributes).forEach(async (key) => {
			if (bodyRegisterAnul.hasOwnProperty(key) && currentOrder && currentOrder[key]) {
				if (key.startsWith('mp') && currentOrder[key] != 0) {
					bodyRegisterAnul[key] = currentOrder[key] * -1;
					bodyRegisterAnul['amount'] = currentOrder[key]* -1;
					bodyRegisterAnul['title'] = `Anulacion -${attributes[key]}-Orden: ${currentOrder.idOrderH}`;

					await requestHandler.post('/api/v2/tracking/add', bodyRegisterAnul);
				} else {
					bodyRegisterAnul[key] = currentOrder[key];
				}
			}
		});
	}

	const actions = {
		1: async () => {
			const res2 =  await requestHandler.get('/api/v2/order/reverse/masive/' + orderId);
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
		5: async () => {
			const res2 =  await requestHandler.get('/api/v2/order/reverse/masive/' + orderId);
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
		7: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames['Por facturar']].state,
				status: statusNames['Por facturar'],
			}));
		},
	};

	const handleOpenModal = (status) => {

		actions[status]();
	};

	const handleCloseModal = () => {
		setModal(initialModalState);
	};

	const perfil = async () => { };
	perfil();

	return (
		<>
			
			{(
				<List.Item style={{ width: '100%' }}>
					<h3 className="font-bold">Actualizar Estado</h3>
					<Space>
						{status == 1 && (
							<>
								<Button
									onClick={() => handleOpenModal(statusNames.Anulado)}
									danger
								>
									<CloseCircleOutlined /> Anular pedido
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames['Por pagar'])}
									danger
								>
									<CloseCircleOutlined /> Devolución parcial
								</Button>
								
							</>
						)}
						{status == 2 && (
							<>
								<Button
									onClick={() => handleOpenModal(statusNames.Anulado)}
									danger
								>
									<CloseCircleOutlined /> Anular pedido
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames['Por pagar'])}
									danger
								>
									<CloseCircleOutlined /> Devolución parcial
								</Button>

							</>
						)}
						{status == 3 && (
							<>
								<Button
									onClick={() => handleOpenModal(statusNames.Anulado)}
									danger
								>
									<CloseCircleOutlined /> Anular pedido
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames.Cobrado)}
									type="success"
								>
									<CreditCardOutlined /> Cobrar
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames['Por pagar'])}
									danger
								>
									<CloseCircleOutlined /> Devolución parcial
								</Button>
							</>
						)}
						{status == 4 && (
							<>
								<Button
									onClick={() => handleOpenModal(statusNames.Anulado)}
									danger
								>
									<CloseCircleOutlined /> Anular pedido
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames.Cobrado)}
									type="success"
								>
									<CreditCardOutlined /> Cobrar
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames['Por pagar'])}
									danger
								>
									<CloseCircleOutlined /> Devolución parcial
								</Button>
							</>
						)}
						{status == 5 && (
							<>
								<Button
									onClick={() => handleOpenModal(statusNames.Eliminado)}
									danger
								>
									<CloseCircleOutlined /> Anular pedido
								</Button>
								<Button
									onClick={() => handleOpenModal(statusNames['Por pagar'])}
									danger
								>
									<CloseCircleOutlined /> Devolución parcial
								</Button>
								
							</>
						)}
						{status == 6 && <></>}
						{status == 7 && <></>}
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
						<Button
							key="submit"
							primary
							onClick={() => handleChangeStatus(modal.status)}
						>
							Aceptar
						</Button>
					</div>,
				]}
			>
				<p>{`¿Seguro de marcar este pédido como '${modal.action}'?`}</p>
			</Modal>
		</>
	);
}
