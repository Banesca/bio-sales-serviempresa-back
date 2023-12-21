import React, { useContext, useEffect, useState, useMemo } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { FileImageOutlined, EditOutlined } from '@ant-design/icons';
import {
	Button,
	Form,
	Input,
	Modal,
	Table,
	Space,
	List,
	Select,
	Row,
	Col,
} from 'antd';
import { useRequest } from '../../../hooks/useRequest';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import AbonosFilters from '../../../components/abonos/abonosFilter';
import { LeftOutlined } from '@ant-design/icons';
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
	const [open, setOpen] = useState(false);
	const [abonos, setAbonos] = useState([]);
	const [nombre, setNombre] = useState([]);
	const [descripcion, setDescripcion] = useState([]);
	const [abono, setAbono] = useState([]);
	const [montoTotal, setMontoTotal] = useState([]);
	const [deuda, setDeuda] = useState([]);
	const [totalAbonos, setTotal] = useState([]);
	const [PaymentAdd, setPaymentToAdd] = useState([]);
	const [PaymentAbono, setPaymentAbono] = useState('');
	const [Payment, setPayment] = useState();
	const [pago, setPago] = useState(0);
	const [abono2, setAbono2] = useState(0);
	const [phoneFG, setPhoneFG] = useState(0);
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
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					<Button onClick={() => showModal2(record)}>
						<FileImageOutlined />
					</Button>
				</Space>
			),
		},
	];

	const [query, setQuery] = useState({
		fullNameClient: null,
	});
	const columns2 = [
		{ title: 'Monto', dataIndex: 'amount', key: 'amount' },
		{ title: 'Descripcion', dataIndex: 'title', key: 'title' },
		{
			title: 'Accion',
			render: (index, record) => (
				<Button onClick={() => showModal(record)}>
					<EditOutlined />
				</Button>
			),
		},
	];
	const handleReturn = () => {
		setOpen(false);
		setOpen2(true);
	};
	const showModal2 = (productos) => {
		setOpen2(true);
		setProductsDetail(productos);
		handleOnChang3(productos);
	};
	const showModal = (productos) => {
		setOpen2(false);
		setOpen(true);
		setProductsDetail(productos);
		setDescripcion(productos.title);
	};

	const handleAbonarClick = async () => {
		console.log(abonos);
		const walletBody = createWalletBody(abono2, PaymentAbono, abonos);
		console.log(walletBody);
		if (walletBody) {
			const response = await requestHandler.post('/api/v2/wallet/add', {
				data:walletBody,
			});
			console.log(response);
		}
	};

	const handleAbono2Change = (event) => {
		setAbono2(event.target.value);
	};

	const getPayments = async () => {
		const res = await requestHandler.get('/api/v2/utils/typepayment');
		if (res.isLeft()) {
			throw res.value.getErrorValue();
		}
		setPayment(res.value.getValue().response);
		console.log(Payment);
	};

	const handleOnChang3 = async (resp) => {
		let id = resp.idClientFk;
		console.log(id);
		setAbono(resp.abonos);
		setDeuda(resp.deuda);
		setNombre(resp.nameclient);
		setMontoTotal(resp.amount);
		const res = await requestHandler.get(`/api/v2/wallet/get/` + id + `/1000`);
		console.log(res);
		if (!res.isLeft()) {
			let value = res.value.getValue();
			value = value.data;
			setAbonos(value);
		}
		console.log(abonos);
	};

	function createWalletBody(abono2, PaymentAbono, abonos) {
		const firstAbono = abonos[0];
		console.log(firstAbono);
		const walletBody = {
			title: 'Abono en $ ' + abono2 + ` Deuda pedido: #${firstAbono.title}`,
			amount: abono2,
			nameclient: firstAbono.nameclient,
			idUserAddFk: firstAbono.idUserAddFk,
			isEntry: 1,
			idClientFk: firstAbono.idClientFk,
			idBranchFk: firstAbono.idBranchFk,
			idCurrencyFk: 99,
			idPaymentMethodFk: PaymentAbono,
			idOrder: firstAbono.idOrder,
		};
		console.log(walletBody);
		return walletBody;
	}

	useEffect(() => {
		getAccountsReceivable();
		getClientsRequest();
		getPayments();
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

	const handleCancel2 = () => {
		setOpen2(false);
	};
	const handleCancel = () => {
		setOpen(false);
	};

	const cancelModal = (event) => {
		setOpenModal(false);
	};

	const Accounts = useMemo(() => {
		let list = AccountsReceivable;

		if (query.nameclient) {
			if (list) {
				list = list.filter((o) => o.nameclient == query.nameclient);
			}
		}

		return list;
	}, [query, AccountsReceivable]);

	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Cuentas por cobrar'} goBack={false}></Title>
				<AbonosFilters
					setQuery={setQuery}
					getOrdersRequest={getClientsRequest}
				/>
				<Table columns={columns} dataSource={Accounts} />
			</div>
			<Modal
				open={open2}
				onCancel={handleCancel2}
				title={`Usuario: ${nombre}`}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-1">
						<Button danger key="cancel" onClick={handleCancel2}>
							Cancelar
						</Button>
					</div>,
				]}
				width={760}
			>
				<Table columns={columns2} dataSource={abonos} />
			</Modal>
			<Modal
				open={open}
				onCancel={handleCancel}
				footer={[
					<Button
						style={{ marginRight: '48%', height: '42px', borderRadius: '20px' }}
						onClick={handleReturn}
					>
						<LeftOutlined style={{ fontSize: '1.5rem', marginRight: '50%' }} />
					</Button>,
					<div
						className="flex justify-center gap-1"
						style={{ marginBottom: '10px' }}
					>
						<p style={{ fontWeight: 'bold' }}>Usuario:{nombre}</p>
						<p style={{ fontWeight: 'bold' }}>Descripcion: {descripcion}</p>
					</div>,
					<div
						className="flex justify-center gap-1"
						style={{ marginBottom: '10px' }}
					>
						<p style={{ fontWeight: 'bold' }}>Abonos: {abono}</p>
						<p style={{ fontWeight: 'bold' }}>Deuda: {deuda}</p>
						<p style={{ fontWeight: 'bold' }}>Monto total: {montoTotal}</p>
					</div>,

					<Row gutter={16}>
						<Col xs={24} sm={24} md={12} lg={12} xl={12}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<p>Metodo de pago:</p>
								<List.Item>
									<Select
										style={{ width: '100%' }}
										onChange={(value) => setPaymentToAdd(value)}
									>
										{Payment &&
											Payment.map((Payment) => (
												<Select.Option
													key={Payment.idPymentMethod}
													value={Payment.pymentMethod}
												>
													{Payment.pymentMethod}
												</Select.Option>
											))}
									</Select>
								</List.Item>
								<Form.Item
									label="Monto a pagar"
									name="pago"
									style={{ width: '50%' }}
								>
									<Input />
								</Form.Item>
								<Button>Pagar</Button>
							</div>
						</Col>

						<Col xs={24} sm={24} md={12} lg={12} xl={12}>
							<div
								className=""
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<p>Metodo de pago:</p>
								<List.Item>
									<Select
										style={{ width: '100%' }}
										onChange={(value) => setPaymentAbono(value)}
									>
										{Payment &&
											Payment.map((Payment) => (
												<Select.Option
													key={Payment.idPymentMethod}
													value={Payment.pymentMethod}
												>
													{Payment.pymentMethod}
												</Select.Option>
											))}
									</Select>
								</List.Item>
								<Form.Item
									label="Monto a abonar"
									name="abono2"
									style={{ width: '50%' }}
								>
									<Input onChange={handleAbono2Change} />
								</Form.Item>
								<Button onClick={handleAbonarClick}>Abonar</Button>
							</div>
						</Col>
					</Row>,

					<div
						style={{ width: '100%', display: 'flex', justifyContent: 'right' }}
					>
						<Button danger key="cancel" onClick={handleCancel}>
							Cancelar
						</Button>
					</div>,
				]}
				width={1000}
			></Modal>
		</DashboardLayout>
	);
};

export default Cuentas;
