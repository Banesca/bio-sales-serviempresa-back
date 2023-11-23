import React, { useContext, useEffect, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { FileImageOutlined } from '@ant-design/icons';
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
	const [productsDetail, setProductsDetail] = useState([]);
	const [open2, setOpen2] = useState(false);
	const [abonos, setAbonos] = useState([]);
	const [nombre, setNombre] = useState([]);
	const [totalAbonos, setTotal] = useState([]);
	const columns = [
		{ title: 'Nombre del cliente', dataIndex: 'nameclient', key: 'nameclient' },
		{ title: 'abonos', dataIndex: 'abonos', key: 'abonos' },
		{ title: 'cuentas', dataIndex: 'amount', key: 'amount' },
		{ title: 'deuda', dataIndex: 'deuda', key: 'deuda' },
		{
			title: 'Accion',
			dataIndex: 'idReportVisit',
			key: '6',
			render: (index, record) => (
				<Button onClick={() => showModal2(record)}>
					<FileImageOutlined />
				</Button>
			),
		},
	];
	
	const columns2 = [
		{ title: 'abonos', dataIndex: 'amount', key: 'amount' },
		{ title: 'Descripcion', dataIndex: 'title', key: 'title' },
	];

	const showModal2 = (productos) => {
		setOpen2(true);
		setProductsDetail(productos);
		handleOnChang3(productos);
	};

	const handleOnChang3 = async (resp) => {
		let id = resp.idClientFk;
		console.log(id);
		setNombre(resp.nameclient);
		const res = await requestHandler.get(`/api/v2/wallet/get/` + id + `/1000`);
		console.log(res);
		console.log(totalAbonos)
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data;
			console.log(value);
			setAbonos(value);
		}
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
					idClientFk: obj.data.idClientFk,
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

	const handleChange = (event) => {
		setMessage(event.target.value);
	};
	const handleCancel2 = () => {
		setOpen2(false);
	};

	const cancelModal = (event) => {
		setOpenModal(false);
	};
	/* console.log(productos.nameclient) */
	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Cuentas por cobrar'} goBack={false}></Title>
				<Table columns={columns} dataSource={AccountsReceivable} />
			</div>
			<Modal
				open={open2}
				onCancel={handleCancel2}
				title={`Usuario: ${nombre}`}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-1">
						<Button>Abonar</Button>
						<Button danger key="cancel" onClick={handleCancel2}>
							Cancelar
						</Button>
					</div>,
				]}
				width={760}
			>
				
				<Table columns={columns2} dataSource={abonos} />
			</Modal>
		</DashboardLayout>
	);
};

export default Cuentas;
