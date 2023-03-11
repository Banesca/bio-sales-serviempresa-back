import { Modal } from 'antd';
import { Button, Space } from 'antd';
import { List } from 'antd';
import { useEffect, useState } from 'react';
import { orderStatusToUse } from '../../../pages/dashboard/orders';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useOrders } from '../hooks/useOrders';
import { message } from 'antd';
import { useRouter } from 'next/router';

export const statusNames = {
	'En proceso': 1,
	Facturado: 2,
	'Recibido': 3,
	Procesado: 4,
	Retenido: 5
};

export default function ChangeOrderStatus({
	status,
	orderId,
	handleChangeStatus,
	handleOrder
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
				action: orderStatusToUse[statusNames['En proceso']],
				status: statusNames['En proceso'],
			}));
		},
		2: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Facturado],
				status: statusNames.Facturado,
			}));
		},
		3: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames['Recibido']],
				status: statusNames['Recibido'],
			}));
		},
		4: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Procesado],
				status: statusNames.Procesado,
			}));
		},
		5: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Retenido],
				status: statusNames.Retenido,
			}));
		},
	};

	const handleOpenModal = (status) => {
		actions[status]();
	};

	const handleCloseModal = () => {
		setModal(initialModalState);
	};

	return (
		<>
			{status != 2 && (
				<List style={{ width: '100%' }}>
					<List.Item>
						<h3>Actualizar Estado</h3>
						<Space>
							{status == 1 && (
								<>
									<Button
										onClick={() =>
											handleOrder()
										}
										type="info"
									>
										Concluir pedido
									</Button>
								</>
							)}
							{status == 3 && (
								<>
									<Button
										onClick={() =>
											handleOrder()
										}
										type="success"
									>
										Modificar
									</Button>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames.Procesado
											)
										}
										type="warning"
									>
										Procesar
									</Button>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames.Retenido
											)
										}
										type="primary"
										danger
									>
										Retener
									</Button>
								</>
							)}
							{status == 4 && (
								<>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames.Facturado
											)
										}
										type="success"
									>
										Facturar
									</Button>
								</>
							)}
							{status == 5 && (
								<>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames['Recibido']
											)
										}
										type="warning"
									>
										Procesar
									</Button>
								</>
							)}
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
				okType='primary'
			>
				<p>{`Deseas marcar este pedido como '${modal.action}' ?`}</p>
			</Modal>
		</>
	);
}