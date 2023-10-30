import { Button, Form, Space, message } from 'antd';
import { useMemo, useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function useCars() {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			render: (_, record) => record.fullname,
		},
		{
			title: 'CI',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			render: (_, record) => record.cedula,
		},
		{
			title: 'Licencia',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			render: (_, record) => record.carnet,
		},
		{
			title: 'Acciones',
			align: 'center',
			render: (_, record) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					<Button onClick={() => openDrivers(record)}>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => deleteDrivers(record.idUserDriver)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const columns2 = [
		{
			title: 'Placa',
			dataIndex: 'nameProduct',
			render: (_, record) => record.plate,
		},
		{
			title: 'Modelo',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			render: (_, record) => record.model,
		},
		{
			title: 'Marca',
			width: '160px',
			dataIndex: 'barCode',
			responsive: ['md'],
			render: (_, record) => record.brand,
		},
		{
			title: 'Acciones',
			align: 'center',
			render: (_, record) => (
				<Space
					size="small"
					style={{ justifyContent: 'center', display: 'flex' }}
				>
					<Button onClick={() => openTrucks(record)}>
						<EditOutlined />
					</Button>
					<Button
						type="primary"
						danger
						onClick={() => deleteTrucks(record.idDriver)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const { requestHandler } = useRequest();
	const [drivers, setDrivers] = useState([]);
	const [trucks, setTrucks] = useState([]);

	const [openModal, setOpenModal] = useState(false);
	const [openModal2, setOpenModal2] = useState(false);

	//listar choferes
	const listDrivers = async () => {
		try {
			const res = await requestHandler.get('/api/v2/userdrivers/list');

			if (res.isLeft()) {
				throw res.value.getErrorValue();
			}
			setDrivers(res.value.getValue().response);
		} catch (error) {
			message.error('Ha ocurrido un error');
		}
	};
	//listar camiones
	const listTrucks = async () => {
		try {
			const res = await requestHandler.get('/api/v2/drivers/list');

			if (res.isLeft()) {
				throw res.value.getErrorValue();
			}
			setTrucks(res.value.getValue().response);
		} catch (error) {
			message.error('Ha ocurrido un error');
		}
	};

	useMemo(() => {
		listDrivers();
		listTrucks();
	}, []);

	const [formDrive] = Form.useForm();
	const [formTruck] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [onEdit, setOnEdit] = useState(false);

	const saveDrivers = async (data) => {
		setLoading(true);
		try {
			let res = !onEdit
				? await requestHandler.post('/api/v2/userdrivers/add', data)
				: await requestHandler.put('/api/v2/userdrivers/update', data);
			if (res.isLeft()) throw res.value.getErrorValue();

			closeModals(false);
			listDrivers();
		} catch (error) {
			message.error('Ocurrió un error al registrar.');
		} finally {
			setLoading(false);
		}
	};

	const saveTrucks = async (data) => {
		try {
			let res = !onEdit
				? await requestHandler.post('/api/v2/drivers/add', data)
				: await requestHandler.put('/api/v2/drivers/update', data);
			if (res.isLeft()) throw res.value.getErrorValue();

			closeModals(false);
			listTrucks();
		} catch (error) {
			message.error('Ocurrió un error al registrar.');
		} finally {
			setLoading(false);
		}
	};

	// cerrar modals y limpiar formularios
	const closeModals = () => {
		setOpenModal(false);
		setOpenModal2(false);
		setOnEdit(false);
		formDrive.resetFields();
		formTruck.resetFields();
	};

	// abrir chofer
	const openDrivers = (driver) => {
		setOnEdit(true);
		setOpenModal(true);
		formDrive.setFieldsValue({ ...driver });
	};
	// abrir camión
	const openTrucks = (truck) => {
		console.log({ truck });

		setOnEdit(true);
		setOpenModal2(true);
		formTruck.setFieldsValue({ ...truck });
	};

	// eliminar chofer
	const deleteDrivers = async (idUserDriver) => {
		try {
			let res = await requestHandler.delete(
				`/api/v2/userdrivers/delete/${idUserDriver}`
			);
			if (res.isLeft()) throw res.value.getErrorValue();
			listDrivers();
		} catch (error) {
			message.error('Ocurrió un error al eliminar.');
		}
	};
	// eliminar camión
	const deleteTrucks = async (idDriver) => {
		try {
			let res = await requestHandler.delete(
				`/api/v2/drivers/delete/${idDriver}`
			);
			if (res.isLeft()) throw res.value.getErrorValue();
			listTrucks();
		} catch (error) {
			message.error('Ocurrió un error al eliminar.');
		}
	};

	return {
		columns,
		columns2,
		formDrive,
		formTruck,

		openModal,
		openModal2,

		setOpenModal,
		setOpenModal2,

		saveDrivers,
		saveTrucks,

		loading,

		drivers,
		trucks,

		openDrivers,
		openTrucks,

		closeModals,

		onEdit,
	};
}
