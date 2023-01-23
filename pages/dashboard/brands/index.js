import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../components/layout';
import { GeneralContext } from '../../_app';
import { useRequest } from '../../../hooks/useRequest';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/loading';
import {
	Button,
	Col,
	Collapse,
	Row,
	Table,
	Form,
	Input,
	Modal,
	message,
} from 'antd';
import { Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const BrandsPage = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameSubFamily',
			key: 1,
			render: (text) => text,
		},
		{
			title: 'Acciones',
			key: 2,
			render: (_, item) => (
				<Button
					danger
					type="primary"
					onClick={() => handleOpenDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const [loading, setLoading] = useState(true);

	// list
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [query, setQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState();

	// delete brand
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentBrands, setCurrentBrand] = useState();

	// create
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [brandName, setBrandName] = useState('');
	const [createCategory, setCreateCategory] = useState(null);

	const generalContext = useContext(GeneralContext);
	const { selectedBusiness } = useBusinessProvider();
	const { requestHandler } = useRequest();

	const getCategoriesRequest = async (id) => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/family/list/${id}`);
		if (res.isLeft()) {
			return;
		}
		setCategories(res.value.getValue().response);
		setLoading(false);
	};

	const getBrandsRequest = async (id) => {
		setLoading(true);
		const res = await requestHandler.get(`/api/v2/subFamily/list/${id}`);
		if (res.isLeft()) {
			return;
		}
		let value = res.value.getValue().response;
		value = value.filter((b) => b.idStatus === 1);
		setBrands(value);
		setLoading(false);
	};

	const brandsList = useMemo(() => {
		let list = brands;
		if (query) {
			list = brands.filter((b) =>
				b.name.toLowerCase().includes(query.toLocaleLowerCase())
			);
		}
		if (selectedCategory) {
			list = brands.filter((b) => b.idProductFamily === selectedCategory);
		}
		return list;
	}, [brands, query, selectedCategory]);

	useEffect(() => {
		console.log('list', brandsList);
	}, [brandsList]);

	useEffect(() => {
		console.log('select', selectedCategory);
	}, [selectedCategory]);

	useEffect(() => {
		if (generalContext && selectedBusiness) {
			getBrandsRequest(selectedBusiness.idSucursal);
			getCategoriesRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const deleteBrandRequest = async (id) => {
		const res = await requestHandler.delete(
			`/api/v2/subFamily/delete/${id}`
		);
		if (res.isLeft()) {
			message.error('Ha ocurrido un error');
			return;
		}
		getBrandsRequest(selectedBusiness.idSucursal);
		message.success('Marca Eliminada');
	};

	const handleOpenDeleteModal = (value) => {
		setCurrentBrand(value);
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = async (bool) => {
		setLoading(true);
		if (bool) {
			deleteBrandRequest(currentBrands.idProductSubFamily);
		} else {
			setLoading(false);
		}
		setIsDeleteModalOpen(false);
	};

	const addBrandRequest = async (value) => {
		const data = new FormData();
		data.append('nameSubFamily', value);
		data.append('order', 0);
		data.append('image', null);
		data.append('idSucursalFk', selectedBusiness?.idSucursal);
		data.append('idProductFamilyFk', createCategory);
		const res = await requestHandler.post(`/api/v2/subFamily/add`, data);

		if (res.isLeft()) {
			message.error('Ha ocurrido un error');
			return;
		}
		getBrandsRequest(selectedBusiness.idSucursal);
		message.success('Marca agregada');
	};

	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const [createForm] = Form.useForm();
	const [searchForm] = Form.useForm();

	const onReset = () => {
		searchForm.resetFields();
		setQuery('');
		setSelectedCategory(null);
	};

	const handleSearch = (values) => {
		setQuery(values.nameSubFamily);
		setSelectedCategory(values.idProductFamily);
	};

	const handleCloseCreateModal = async (bool) => {
		setLoading(true);
		if (bool) {
			try {
				const valid = await createForm.validateFields([
					'idFamily',
					'nameSubFamily',
				]);
				console.log('Valid', valid);
				createForm.resetFields();
				addBrandRequest(brandName);
			} catch (error) {
				console.log('error', error);
				setLoading(false);
				return;
			}
		} else {
			setLoading(false);
		}
		setIsCreateModalOpen(false);
	};

	return (
		<DashboardLayout>
			<div
				style={{
					margin: '1rem',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<Row style={{ alignItems: 'center' }}>
					<Col offset={6} span={12}>
						<h1
							style={{
								textAlign: 'center',
								fontSize: '2rem',
								color: '#fff',
							}}
						>
							Marcas
						</h1>
					</Col>
					<Col
						span={6}
						style={{
							justifyContent: 'center',
							display: 'flex',
						}}
					>
						<Button
							type="primary"
							style={{ marginRight: '1rem' }}
							onClick={handleOpenCreateModal}
						>
							Agregar
						</Button>
					</Col>
				</Row>
				<Collapse style={{ width: '100%', marginBottom: '2rem' }}>
					<Collapse.Panel header="Filtros">
						<Form
							style={{ maxWidth: '800px', width: '100%' }}
							labelCol={{ span: 8 }}
							onFinish={handleSearch}
							form={searchForm}
						>
							<Row>
								<Col span={12}>
									<Form.Item
										label="Nombre"
										name="nameSubFamily"
										style={{ padding: '0 .5rem' }}
									>
										<Input allowClear />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Categoría"
										name="idFamily"
										style={{ padding: '0 .5rem' }}
									>
										<Select allowClear>
											{categories &&
												categories.map((c) => (
													<Select.Option
														key={c.idProductFamily}
														value={
															c.idProductFamily
														}
													>
														{c.name}
													</Select.Option>
												))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
							<Row>
								<Col span={12}>
									<Form.Item
										wrapperCol={{
											span: 12,
											offset: 8,
										}}
									>
										<Button block onClick={onReset}>
											Limpiar
										</Button>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										wrapperCol={{ span: 12, offset: 8 }}
									>
										<Button
											htmlType="submit"
											type="primary"
											block
										>
											Buscar
										</Button>
									</Form.Item>
								</Col>
							</Row>
						</Form>
					</Collapse.Panel>
				</Collapse>
				<Table bordered dataSource={brandsList} columns={columns} />
				<Modal
					title="Agregar"
					onCancel={() => handleCloseCreateModal(false)}
					open={isCreateModalOpen}
					footer={[
						<Button
							key="cancel"
							onClick={() => handleCloseCreateModal(false)}
						>
							Cancelar
						</Button>,
						<Button
							key="delete"
							type="primary"
							onClick={() => handleCloseCreateModal(true)}
						>
							Agregar
						</Button>,
					]}
				>
					<Form form={createForm}>
						<Form.Item
							label="Nombre"
							name="nameSubFamily"
							required
							rules={[
								{
									required: true,
									message: 'Ingresa un nombre',
								},
							]}
						>
							<Input
								allowClear
								value={brandName}
								onChange={(e) => setBrandName(e.target.value)}
							/>
						</Form.Item>
						<Form.Item
							label="Categoría"
							name="idFamily"
							required
							rules={[
								{
									required: true,
									message: 'Elige una categoría',
								},
							]}
						>
							<Select
								value={createCategory}
								onChange={(value) => setCreateCategory(value)}
							>
								{categories &&
									categories.map((c) => (
										<Select.Option
											key={c.idProductFamily}
											value={c.idProductFamily}
										>
											{c.name}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					</Form>
				</Modal>
				<Modal
					title="Eliminar"
					open={isDeleteModalOpen}
					onCancel={() => setIsDeleteModalOpen(false)}
					footer={[
						<Button
							key="cancel"
							onClick={() => handleCloseDeleteModal(false)}
						>
							Cancelar
						</Button>,
						<Button
							key="delete"
							danger
							type="primary"
							onClick={() => handleCloseDeleteModal(true)}
						>
							Eliminar
						</Button>,
					]}
				>
					<p>
						{`Estas seguro de que deseas eliminar la marca ${currentBrands?.name}`}
					</p>
				</Modal>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default BrandsPage;
