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
	Facturado: 2,
	'Completada': 3,
	Procesada: 4,
	Retenida: 5
};

export default function ChangeOrderStatus({
	status,
	orderId,
	handleChangeStatus,
}) {
	const initialModalState = {
		visible: false,
		action: '',
		status: 0,
	};

	const [modal, setModal] = useState(initialModalState);

	const actions = {
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
				action: orderStatusToUse[statusNames['Completada']],
				status: statusNames['Completada'],
			}));
		},
		4: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Procesada],
				status: statusNames.Procesada,
			}));
		},
		5: () => {
			setModal((prev) => ({
				...prev,
				visible: true,
				action: orderStatusToUse[statusNames.Retenida],
				status: statusNames.Retenida,
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
							{status == 3 && (
								<>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames['Completada']
											)
										}
										type="warning"
									>
										Procesar
									</Button>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames.Retenida
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
										type="warning"
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
												statusNames['Completada']
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
				okText="Actualizar"
				cancelText="Cancelar"
				onCancel={handleCloseModal}
				onOk={() => handleChangeStatus(modal.status)}
			>
				<p>{`Deseas marcar este pedido como '${modal.action}' ?`}</p>
			</Modal>
		</>
	);
}
