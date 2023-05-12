import { Modal } from 'antd';
import { Button, Space } from 'antd';
import { List } from 'antd';
import { useState } from 'react';
import { orderStatusToUse } from '../../../pages/dashboard/orders';

export const statusNames = {
	'Por facturar': 1,
	Completado: 2,
	Facturado: 3,
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
				action: orderStatusToUse[statusNames['Por facturar']].state,
				status: statusNames['Por facturar'],
			}));
		},
		2: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Completado].state,
				status: statusNames.Completado,
			}));
		},
		3: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Facturado].state,
				status: statusNames.Facturado,
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
				<List style={{ width: '100%' }}>
					<List.Item>
						<h3 className="font-bold">Actualizar Estado</h3>
						<Space>
							{status == 1 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										Anular pedido
									</Button>
									<Button onClick={() => handleOrder()} type="info">
										Concluir pedido
									</Button>
								</>
							)}
							{status == 3 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										Anular pedido
									</Button>
									<Button
										onClick={() => handleOpenModal(statusNames.Retenido)}
										type="primary"
										danger
									>
										Retener
									</Button>
									<Button
										onClick={() => handleOpenModal(statusNames.Procesado)}
										type="warning"
									>
										Procesar
									</Button>
								</>
							)}
							{status == 4 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										Anular pedido
									</Button>
									<Button
										onClick={() => handleOpenModal(statusNames.Facturado)}
										type="success"
									>
										Facturar
									</Button>
								</>
							)}
							{status == 5 && (
								<>
									<Button
										onClick={() => handleOpenModal(statusNames.Anulado)}
										danger
									>
										Anular pedido
									</Button>
									<Button
										onClick={() => handleOpenModal(statusNames['Procesado'])}
										type="warning"
									>
										Procesar
									</Button>
								</>
							)}
							{status == 6 && <></>}
						</Space>
					</List.Item>
				</List>
			)}
			<Modal
				open={modal.visible}
				title="Actualizar estado"
				okText="Aceptar"
				cancelText="Cancelar"
				onCancel={handleCloseModal}
				onOk={() => handleChangeStatus(modal.status)}
				okType="primary"
			>
				<p>{`Deseas marcar este pedido como '${modal.action}' ?`}</p>
			</Modal>
		</>
	);
}
