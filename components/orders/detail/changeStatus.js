import { Modal } from 'antd';
import { Button, Space } from 'antd';
import { List } from 'antd';
import { useEffect, useState } from 'react';
import { orderStatusToUse } from '../../../pages/dashboard/orders';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useOrders } from '../hooks/useOrders';
import { message } from 'antd';
import { useRouter } from 'next/router';

const statusNames = {
	Facturado: 2,
	'En Proceso': 3,
	Retenido: 4,
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
				action: orderStatusToUse[statusNames['En Proceso']],
				status: statusNames['En Proceso'],
			}));
		},
		4: () => {
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
											handleOpenModal(
												statusNames['En Proceso']
											)
										}
										type="primary"
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
							{status == 3 && (
								<>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames.Facturado
											)
										}
										type="primary"
									>
										Facturar
									</Button>
								</>
							)}
							{status == 4 && (
								<>
									<Button
										onClick={() =>
											handleOpenModal(
												statusNames['En Proceso']
											)
										}
										type="primary"
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
