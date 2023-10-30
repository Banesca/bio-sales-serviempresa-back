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
	const [documento, setDocumento] = useState('');
	const [tiempo, setTiempo] = useState('');
	const [horario, setHorario] = useState('');
	const [iva, setIva] = useState('');
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
		setId(record.idSucursal);
		console.log(idSucu);
	};

	const [formState, setFormState] = useState({
		nombre: '',
		numero: '',
		razon: '',
		documento: '',
		tiempo: '',
		horario: '',
		iva: '',
		direccion: '',
	});

	const handleChange = (event) => {
		setFormState({
			...formState,
			[event.target.name]: event.target.value,
		});
	};

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
				};
			});
			setSucursales(listaSucursales);
		}
	};

	const addSucursal = async () => {
		const response = await requestHandler.post('/api/v2/mapas/add', {
			location: body,
			nameSucursal: nombre,
		});
		if (!response.isLeft()) {
			const value = response.value._value.response;
			setSucursales(value);
		}
		setOpenModal(false);
	};

	const updateSucursal = async () => {
		console.log(idSucu);
		console.log(body);
		console.log(nombre);
		const response = await requestHandler.put('/api/v2/mapas/update', {
			id: idSucu,
			location: body,
			nameSucursal: nombre,
		});
		if (!response.isLeft()) {
			const value = response.value._value.response;
			setSucursales(value);
		}
		setOpenModal(false);
	};

	let body = {
		nameSucursal: nombre,
		liWs: numero,
		address: direccion,
		clienteid: iva,
		secretid: documento,
		nameAppExternal: razon,
		deliveryStore: horario,
		delieveryExternal: tiempo,
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
							<p>Numero de Whatsapp</p>
							<Input
								name="numero"
								onChange={handleChange}
								value={formState.numero}
								placeholder="Numero de Whatsapp"
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
							<p>Nro de documento</p>
							<Input
								name="documento"
								onChange={handleChange}
								value={formState.documento}
								placeholder="Nro de documento"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Tiempo de espera</p>
							<Input
								name="tiempo"
								onChange={handleChange}
								value={formState.tiempo}
								placeholder="Tiempo de espera"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Horario</p>
							<Input
								name="horario"
								onChange={handleChange}
								value={formState.horario}
								placeholder="Horario"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Iva por defecto</p>
							<Input
								name="iva"
								onChange={handleChange}
								value={formState.iva}
								placeholder="Iva por defecto"
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
							<p>Nombre de la sucursal</p>
							<Input
								name="nombre"
								onChange={handleChange}
								value={formState.nombre}
								placeholder={nombreSucursal}
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Numero de Whatsapp</p>
							<Input
								name="numero"
								onChange={handleChange}
								value={formState.numero}
								placeholder="Numero de Whatsapp"
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
							<p>Nro de documento</p>
							<Input
								name="documento"
								onChange={handleChange}
								value={formState.documento}
								placeholder="Nro de documento"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Tiempo de espera</p>
							<Input
								name="tiempo"
								onChange={handleChange}
								value={formState.tiempo}
								placeholder="Tiempo de espera"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Horario</p>
							<Input
								name="horario"
								onChange={handleChange}
								value={formState.horario}
								placeholder="Horario"
							></Input>
						</Form.Item>
						<Form.Item>
							<p>Iva por defecto</p>
							<Input
								name="iva"
								onChange={handleChange}
								value={formState.iva}
								placeholder="Iva por defecto"
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
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default Sucursal;
