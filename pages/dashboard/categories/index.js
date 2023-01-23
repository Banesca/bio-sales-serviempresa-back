import { useContext, useEffect, useMemo, useState } from 'react';
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
import { DeleteOutlined } from '@ant-design/icons';

const CategoriesPage = () => {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
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
	const [query, setQuery] = useState('');

	// delete category
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentCategory, setCurrentCategory] = useState();

	// create
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [categoryName, setCategoryName] = useState('');

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

	const categoriesList = useMemo(() => {
		let list = categories;
		if (query) {
			list = categories.filter((c) =>
				c.name.toLowerCase().includes(query.toLocaleLowerCase())
			);
		}
		return list;
	}, [categories, query]);

	useEffect(() => {
		console.log('list', categoriesList);
	}, [categoriesList]);

	useEffect(() => {
		if (generalContext && selectedBusiness) {
			getCategoriesRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	const deleteCategoryRequest = async (id) => {
		const res = await requestHandler.delete(`/api/v2/family/delete/${id}`);
		if (res.isLeft()) {
			message.error('Ha ocurrido un error');
			return;
		}
		getCategoriesRequest(selectedBusiness.idSucursal);
		message.success('Categoría Eliminada');
	};

	const handleOpenDeleteModal = (value) => {
		setCurrentCategory(value);
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = async (bool) => {
		setLoading(true);
		if (bool) {
			deleteCategoryRequest(currentCategory.idProductFamily);
		} else {
			setLoading(false);
		}
		setIsDeleteModalOpen(false);
	};

	const addCategoryRequest = async (value) => {
		const res = await requestHandler.post(`/api/v2/family/add`, {
			name: value,
			order: 0,
			image: null,
			idSucursalFk: selectedBusiness?.idSucursal,
		});

		if (res.isLeft()) {
			message.error('Ha ocurrido un error');
			return;
		}
		getCategoriesRequest(selectedBusiness.idSucursal);
		message.success('Categoría agregada');
	};

	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const [searchForm] = Form.useForm();
	const [createForm] = Form.useForm();

	const handleCloseCreateModal = async (bool) => {
		setLoading(true);
		if (bool) {
			try {
				const valid = await createForm.validateFields(['name']);
				createForm.resetFields();
				addCategoryRequest(categoryName);
			} catch (error) {
				setLoading(false);
				return;
			}
		} else {
			setLoading(false);
		}
		setIsCreateModalOpen(false);
	};

	const handleSearch = (values) => {
		setQuery(values.name);
	};

	const onReset = () => {
		setQuery('');
		searchForm.resetFields();
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
							Categorías
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
							labelCol={{ span: 6 }}
							onFinish={handleSearch}
							form={searchForm}
						>
							<Row>
								<Col span={24}>
									<Form.Item
										label="nombre"
										name="name"
										wrapperCol={{
											span: 16,
										}}
									>
										<Input allowClear />
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
				<Table bordered dataSource={categoriesList} columns={columns} />
				<Modal
					title="Agregar"
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
							label="nombre"
							name="name"
							style={{ padding: '0 .5rem' }}
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
								value={categoryName}
								onChange={(e) =>
									setCategoryName(e.target.value)
								}
							/>
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
						{`Estas seguro de que deseas eliminar la categoría ${currentCategory?.name}`}
					</p>
				</Modal>
			</div>
			<Loading isLoading={loading} />
		</DashboardLayout>
	);
};

export default CategoriesPage;
