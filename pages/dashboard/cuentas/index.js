import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table } from 'antd';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
const Cuentas = () => {
	const [openModal, setOpenModal] = useState(false);
	const { requestHandler } = useRequest();
	const [AccountsReceivable, setAccountsReceivable] = useState();
	const [clients, setClients] = useState([]);
	const [message, setMessage] = useState('');
	const { selectedBusiness } = useBusinessProvider();
	const generalContext = useContext(GeneralContext);
	const { loading, setLoading } = useLoadingContext();
	const columns = [
		{ title: 'Nombre del cliente', dataIndex: 'nameclient', key: 'nameclient' },
		{ title: 'abonos', dataIndex: 'abonos', key: 'abonos' },
		{ title: 'cuentas', dataIndex: 'amount', key: 'amount' },
		{ title: 'deuda', dataIndex: 'deuda', key: 'deuda' },
	];

	const accountsReceivable = () => {
		getAccountsReceivable();
	};

	useEffect(() => {
		getAccountsReceivable();
		getClientsRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setLoading(true);
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			getAccountsReceivable(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const getAccountsReceivable = async () => {
		console.log(selectedBusiness.idSucursal);
		let id = selectedBusiness.idSucursal;
		try {
			const response = await requestHandler.get(
				`/api/v2/wallet/list/client/deuda/${id}`
			);
			console.log(response.value);

			if (
				response.value._value &&
				response.value._value.list &&
				Array.isArray(response.value._value.list)
			) {
				const arrayForTable = response.value._value.list.map((obj) => ({
					nameclient: obj.data.nameclient,
					amount: obj.amount,
					abonos: obj.abonos,
					deuda: obj.deuda,
				}));

				console.log(arrayForTable);
				setAccountsReceivable(arrayForTable);
			} else {
				console.error('Unexpected response from API:', response.value);
			}
		} catch (error) {
			console.error('Hubo un error al hacer la petición:', error);
		}
	};


	const getClientsRequest = async () => {
		/* const res = await requestHandler.get('/api/v2/client/list'); */
		/* 	if (!res.isLeft()) {
			let clientsList = res.value.getValue().response;
			clientsList = clientsList.filter((b) => b.idStatusFk !== '3');
			setClients(clientsList);
		} */
	};

	const getAccountsReceivableAdd = async () => {
		const data = {
			note: message,
		};
		/* const response = await requestHandler.post(
			'/api/v2/paymentcondition/add',
			data
		); */
		/* if (!response.isLeft()) {
			const value = response.value._value.response;
			setAccountsReceivable(value);
		} */
		setOpenModal(false);
		getAccountsReceivable();
		setMessage('');
	};

	const showModal = () => {
		setOpenModal(true);
	};

	const handleChange = (event) => {
		setMessage(event.target.value);
	};

	const cancelModal = (event) => {
		setOpenModal(false);
	};

	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Cuentas por cobrar'} goBack={false}>
					{/* <Button className="bg-white" onClick={showModal}>
						<AppstoreAddOutlined />
						Crear
					</Button> */}
				</Title>
				<Table columns={columns} dataSource={AccountsReceivable} />
			</div>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				footer={
					<div className="flex justify-end">
						<Button danger onClick={cancelModal}>
							Cancelar
						</Button>
						<Button
							type="primary"
							className="bg-blue-500"
							onClick={getAccountsReceivableAdd}
						>
							Guardar
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-5">
					<h1>Ingrese el nombre o descripción</h1>
					<Form>
						<Form.Item>
							<Input
								onChange={handleChange}
								value={message}
								placeholder="Condición de pago"
							></Input>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default Cuentas;
