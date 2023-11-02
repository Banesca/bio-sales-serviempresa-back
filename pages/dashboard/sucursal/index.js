import {
	Button,
	Card,
	Col,
	ConfigProvider,
	Form,
	Modal,
	Input,
	Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import { useRequest } from '../../../hooks/useRequest';
import { ip } from '/util/environment.js';
import {
	FileImageOutlined,
	AppstoreAddOutlined,
	EditOutlined,
} from '@ant-design/icons';

const Sucursal = () => {
	const { requestHandler } = useRequest();
	const [sucursales, setSucursales] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModal2, setOpenModal2] = useState(false);
	const [nombre, setNombre] = useState('');
	const [numero, setNumero] = useState('');
	const [razon, setRazon] = useState('');
	const [rif, setRif] = useState('');
	const [direccion, setDireccion] = useState('');
	const [nombreSucursal, setNombreSursal] = useState();
	const [idSucu, setId] = useState();

	const columns = [
		{
			title: 'Sucursales',
			dataIndex: 'sucursal',
			key: 1,
		},
		{
			title: 'Acciones',
			render: (record) => (
				<Button onClick={() => showModal2(record)}>
					<EditOutlined />
				</Button>
			),
		},
	];

	useEffect(() => {
		getSucursales();
	}, []);

	const showModal = () => {
		setOpenModal(true);
	};
	const showModal2 = (record) => {
		setOpenModal2(true);
		console.log(record);
		setNombreSursal(record.sucursal);
		setNumero(record.liWs);
		setRazon(record.nameAppExternal);
		setRif(record.timeDelivery)
		setDireccion(record.address);
		setId(record.idSucursal);
		console.log(idSucu);
	};

	const [formState, setFormState] = useState({
		nombre: '',
		razon: '',
		rif: '',
		direccion: '',
		numero: '',
	});

	const handleChange = (event) => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	};

	useEffect(() => {
		console.log(formState);
	}, [formState]);

	const cancelModal = (event) => {
		setOpenModal(false);
	};
	const cancelModal2 = (event) => {
		setOpenModal2(false);
	};

	const getSucursales = async () => {
		const res = await requestHandler.get(`/api/v2/mapas/list/all`);
		let value = res.value.getValue();
		if (value && Array.isArray(value.mapas)) {
			let listaSucursales = value.mapas.map((mapa) => {
				return {
					sucursal: mapa.sucursal,
					idSucursal: mapa.idSucursal,
					nameAppExternal:mapa.nameAppExternal,
					timeDelivery:mapa.timeDelivery,
					address:mapa.address,
					liWs:mapa.liWs
				};
			});
			setSucursales(listaSucursales);
		}
	};

	const addSucursal = async () => {
		console.log(body);
		const response = await requestHandler.post('/api/v2/mapas/add', {
			location: body,
			nameSucursal: formState.nombre,
		});
		if (!response.isLeft()) {
			const value = response.value._value.response;
			setSucursales(value);
		}
		setOpenModal(false);
	};

	const updateSucursal = async () => {
		const response = await requestHandler.put('/api/v2/mapas/update', {
			nameSucursal: formState.nombre,
			timeStore: "0",
			timeDelivery: formState.rif,
			liWs: formState.numero,
			isOpen: "0",
			numberBank: "0",
			address: formState.direccion,
			clienteid: "0",
			secretid: "0",
			nameAppExternal: formState.razon,
			deliveryStore: formState.rif,
			delieveryExternal: "0",
			squedule: "0",
			isChash: "0",
			isDebit: "0",
			isTransfer: "0",
			isCredit: "0",
			isBofa: "0",
			isPayapal: "0",
			isZelle: "0",
			accountPayapal: "0",
			accountZelle: "0",
			accountBofa: "0",
			idSucursal: idSucu,
			areas: "0",
		});
		if (!response.isLeft()) {
			const value = response.value._value.response;
			setSucursales(value);
		}
		setOpenModal(false);
	};

	let body = {
		nameSucursal: formState.nombre,
		nameAppExternal: formState.razon,
		timeDelivery: formState.rif,
		address: formState.direccion,
		liWs: formState.numero,
	};


	

	return (
		<DashboardLayout>
			<div className="p-4 m-4">
				<Title title={'Sucursales'} goBack={false}>
					<Button className="bg-white" onClick={showModal}>
						<AppstoreAddOutlined />
						Crear
					</Button>
				</Title>
			</div>
			<div>
				<Table columns={columns} dataSource={sucursales} />
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
							onClick={addSucursal}
						>
							Guardar
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-5">
					<h1>Ingrese los datos de la sucursal</h1>
					<Form>
						<Form.Item>
							<p>Nombre de la sucursal</p>
							<Input
								name="nombre"
								onChange={handleChange}
								value={formState.nombre}
								placeholder="Nombre de la sucursal"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Razon social</p>
							<Input
								name="razon"
								onChange={handleChange}
								value={formState.razon}
								placeholder="Razon social"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Rif</p>
							<Input
								name="rif"
								onChange={handleChange}
								value={formState.rif}
								placeholder="Nro de rif"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Dirección</p>
							<Input
								name="direccion"
								onChange={handleChange}
								value={formState.direccion}
								placeholder="Dirección"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Contacto</p>
							<Input
								name="numero"
								onChange={handleChange}
								value={formState.numero}
								placeholder="Numero de Whatsapp"
							></Input>
						</Form.Item>
					</Form>
				</div>
			</Modal>
			<Modal
				open={openModal2}
				onCancel={() => setOpenModal2(false)}
				footer={
					<div className="flex justify-end">
						<Button danger onClick={cancelModal2}>
							Cancelar
						</Button>
						<Button
							type="primary"
							className="bg-blue-500"
							onClick={updateSucursal}
						>
							Guardar
						</Button>
					</div>
				}
			>
				<div className="flex flex-col gap-5">
					<h1>Editar datos de la sucursal:{nombreSucursal}</h1>
					<Form>
						<Form.Item>
							<p>Nombre de la sucursal: {nombreSucursal}</p>
							<Input
								name="nombre"
								onChange={handleChange}
								value={formState.nombre}
								placeholder = {nombreSucursal}
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Razon social: {razon}</p>
							<Input
								name="razon"
								onChange={handleChange}
								value={formState.razon}
								placeholder={razon}
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Rif:{rif}</p>
							<Input
								name="rif"
								onChange={handleChange}
								value={formState.rif}
								placeholder={rif}
								
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Dirección: {direccion}</p>
							<Input
								name="direccion"
								onChange={handleChange}
								value={formState.direccion}
								placeholder={direccion}
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Contacto: {numero}</p>
							<Input
								name="numero"
								onChange={handleChange}
								value={formState.numero}
								placeholder={numero}
							></Input>
						</Form.Item>
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default Sucursal;
