import React from 'react';
import DashboardLayout from '../../../components/shared/layout';
import Title from '../../../components/shared/title';
import {
	Button,
	Col,
	ConfigProvider,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Table,
} from 'antd';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';
import { useProductFilter } from '../../../components/products/useProductFilter';
import { PlusOutlined } from '@ant-design/icons';
import useCars from '../../../components/cars/useCars';

const Cars = () => {
	const { filtered } = useProductFilter();
	
	const {
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
		closeModals,

		onEdit,
	} = useCars();

	const FooterModal = () => {
		return <Row justify={'end'} style={{gap: 10, marginTop: 20}}>
			<Button danger onClick={closeModals}>Cancelar</Button>
			<Button type="primary" htmlType='submit' className="bg-blue-500" loading={loading}>
				Guardar
			</Button>
		</Row>
	}

	const rules = [
		{required: true, message: 'El campo es requerido'}
	];

	return (
		<DashboardLayout>
			<div className="m-4 p-4">
				<Title title={'Camiones'}>
					<Button className="bg-white" onClick={() => setOpenModal(true)}>
						<PlusOutlined />
						Agregar un chofer
					</Button>
				</Title>
				<div className="flex flex-col gap-10">
					<ConfigProvider renderEmpty={filtered().length !== 0 || true ? CustomizeRenderEmpty : ''} >
						<Table columns={columns} dataSource={drivers} rowKey={(record) => record.idUserDriver} />
					</ConfigProvider>


					<div>
						<Title>
							<Button className="bg-white" onClick={() => setOpenModal2(true)}>
								<PlusOutlined />
								Agregar un camión
							</Button>
						</Title>
						<ConfigProvider renderEmpty={ filtered().length !== 0 || true ? CustomizeRenderEmpty : ''}>
							<Table columns={columns2} dataSource={trucks} rowKey={(record) => record.idDriver} />
						</ConfigProvider>
					</div>
				</div>
			</div>


			{/* crear / editar - conductor */}
			<Modal open={openModal} onCancel={closeModals} footer={false}>
				<div className="flex flex-col gap-5">
					<h1>{!onEdit ? 'Agrega un chofer' : 'Editar chofer'}</h1>
					<Form layout='vertical' form={formDrive} onFinish={saveDrivers}>
						<Row gutter={24}>
							<Col span={12}>
								<Form.Item label="Nombre Completo" name="fullname" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="CI" name="cedula" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Licencia" name="carnet" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Dirección" name="direccion" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>

							{onEdit && <Form.Item name="idUserDriver" hidden> <Input /></Form.Item> }
						</Row>
						
						<FooterModal close={() => setOpenModal(false)} />
					</Form>
				</div>
			</Modal>

			{/* crear / editar - camion */}
			<Modal open={openModal2} onCancel={closeModals} footer={false}>
				<div className="flex flex-col gap-5">
					<h1>{!onEdit ? 'Agrega un camión' : 'Editar camión'}</h1>
					<Form layout='vertical' form={formTruck} onFinish={saveTrucks}>
						<Row gutter={24}>
							<Col span={24}>
								<Form.Item label="Chofer" name="idUserFk" {...{rules}}>
									<Select placeholder="Seleccionar chofer">
										{drivers.map(({idUserDriver, fullname}) => 
											<Select.Option key={idUserDriver} value={idUserDriver}>{fullname}</Select.Option>
										)}
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Marca" name="brand" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Modelo" name="model" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Placa" name="plate" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Limite de peso" name="mail" {...{rules}}>
									<Input />
								</Form.Item>
							</Col>
							{onEdit && <Form.Item name="idDriver" hidden> <Input /></Form.Item> }

						</Row>
						<FooterModal close={() => setOpenModal2(false)} />
					</Form>
				</div>
			</Modal>
		</DashboardLayout>
	);
};

export default Cars;
