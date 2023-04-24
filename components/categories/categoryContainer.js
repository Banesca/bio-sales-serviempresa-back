import { useState, useMemo, useEffect, useRef } from 'react';
import { DeleteOutlined, EditFilled, EditOutlined } from '@ant-design/icons';
import { ConfigProvider, Empty, Input, Select, Space, Table } from 'antd';
import { Modal } from 'antd';
import { Form } from 'antd';
import { Button, Col, Row } from 'antd';
import CategoryFilters from './categoryFilters';
import Loading from '../shared/loading';
import { useRequest } from '../../hooks/useRequest';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { message } from 'antd';
import { addKeys } from '../../util/setKeys';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Typography } from 'antd';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES } from '../shared/profiles';
import Title from '../shared/title';
import { useRouter } from 'next/router';
import Link from 'next/link';


function useForceUpdate() {
	let [value, setState] = useState(true);
	return () => setState(!value);
}

export default function CategoryContainer() {

	const [log, setLog] = useState();
	
	useEffect(() => {
	  setLog(localStorage.getItem('userProfile'));
	}, []);

	

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'name',
			key: 1,
			render: (text) => text,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 2,
			width: '200px',
			render: (_, item) => (
				<Space size='middle' style={{justifyContent: 'center', display: 'flex'}}>
					<Button
						onClick={() => {
							openEditModal(item);
							setLineBody({...item});
							cancelModalPrueba();
						}}
						disabled={log == PROFILES.BILLER}
					>
						<EditOutlined />
					</Button>
					<Button
						danger
						type="primary"
						onClick={() => handleOpenDeleteModal(item)}
						disabled={log == PROFILES.BILLER}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];


	const { categories, addCategory, deleteCategory, editCategories } = useCategoryContext();

	const [query, setQuery] = useState('');
	// const [loading, setLoading] = useState(false);
	const { setLoading } = useLoadingContext();

	// delete category
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentCategory, setCurrentCategory] = useState();

	// create
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [categoryName, setCategoryName] = useState('');
	const [createForm] = Form.useForm();
	const [createFormTwo] = Form.useForm();

	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	

	const [lineBody, setLineBody] = useState({
		name: '',
		idStatusFk: '',
		idProductFamily: ''
	});

	
/* 	useEffect(() => {
		console.log(lineBody.name);
	}, [lineBody]); */

	useEffect(() => {
		/* console.log(lineBody); */
	}, [lineBody]);

	const addCategoryRequest = async (value) => {
		try {
			setLoading(true);
			await addCategory(value, selectedBusiness.idSucursal);
			setLoading(false);
			message.success('Categoría agregada');
		} catch (error) {
			setLoading(false);
			message.error('Error al agregar categoría');
		}
	};

	// Delete modal
	const handleOpenDeleteModal = (value) => {
		setCurrentCategory(value);
		setIsDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = async (bool) => {
		setLoading(true);
		setIsDeleteModalOpen(false);
		if (bool) {
			await deleteCategoryRequest(currentCategory.idProductFamily);
		} else {
			setLoading(false);
		}
	};

	const deleteCategoryRequest = async (id) => {
		try {
			await deleteCategory(id, selectedBusiness.idSucursal);
			setLoading(false);
			message.success('Categoría eliminada');
		} catch (error) {
			setLoading(false);
			message.error('Error al eliminar categoría');
		}
	};

	const openEditModal = async (value) => {
		createFormTwo.resetFields();
		setCurrentCategory(value);
		setTimeout(cancelModalPrueba, 100);
		setIsEditModalOpen(true);
	}

	// close modal
	const cancelModal = async () => {
		setIsEditModalOpen(false);
		createFormTwo.resetFields();
	}
	const cancelModalPrueba = async () => {
		createFormTwo.resetFields();
	}



	// Update category request
	const handleEditLine = async () => {
		try {
			setLoading(true);
			setIsEditModalOpen(false);
			// console.log(lineBody);
			await editCategories( lineBody.name, lineBody.idStatusFk, lineBody.idProductFamily, selectedBusiness.idSucursal);
			createForm.resetFields();
			message.success('Categoría actualizada');
		} catch (error) {
			setLoading(false);
			message.error('Error al actualizar categoría');
		} finally {
			setLoading(false);
		}
		
	};

	// Edit modal open end);
	


	// Create Category Modal
	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
		createForm.resetFields();
	};

	const validateCategoryName = async () => {
		const res = await requestHandler.post('/api/v2/family/find/name', {
			name: categoryName,
			idSucursalFk: selectedBusiness.idSucursal,
		});
		const value = res.value.getValue();
		return !!value.data;
	};

	const handleCreateCategory = async () => {
		try {
			await createForm.validateFields(['name']);
			const invalidName = await validateCategoryName(categoryName);
			/* if (invalidName) {
				setLoading(false);
				return message.error(`La categoría ${categoryName} ya existe`);
			} */
			handleCloseCreateModal();
			await addCategoryRequest(categoryName);
		} catch (error) {
			message.error('Ha ocurrido un error al crear la categoria')
		}
	};

	const handleCloseCreateModal = async () => {
		setIsCreateModalOpen(false);
		createForm.resetFields();
	};
	// End create category modal

	// Search
	const categoriesList = useMemo(() => {
		let list = categories;
		if (query) {
			list = categories.filter((c) =>
				c.name.toLowerCase().includes(query.toLocaleLowerCase())
			);
		}
		addKeys(list);
		return list;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories, query, addCategory, deleteCategory]);
	// End Search

	const customizeRenderEmpty = () => (
		<Empty image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			style={{
				textAlign: 'center',
				marginBottom: '30px'
			}}
			description={
				<span>
					Sin datos
				</span>
			}
		>
			
		</Empty>
	);

	const handleForceupdateMethod = useForceUpdate();



	return (
		<>
			<Title title="Categorías">
				{log ==
					PROFILES.MASTER || log == PROFILES.ADMIN ? (
						<Button type="success" style={{marginRight: '-2.3rem'}} onClick={handleOpenCreateModal}>
							Agregar
						</Button>
					) : ''}
			</Title>
			<CategoryFilters setQuery={setQuery} />
			<ConfigProvider renderEmpty={customizeRenderEmpty}>

				<Table bordered dataSource={categoriesList} columns={columns} />
			</ConfigProvider>
			<Modal
				title="Agregar"
				open={isCreateModalOpen}
				onOk={handleCreateCategory}
				onCancel={() => handleCloseCreateModal()}
				footer={[
					<Button
						danger
						key="cancel"
						onClick={() => handleCloseCreateModal()}
					>
						Cancelar
					</Button>,
					<Button
						key="delete"
						type="success"
						onClick={handleCreateCategory}
					>
						Agregar
					</Button>,
				]}
			>
				<Form form={createForm}>
					<Form.Item
						label="Categoría"
						name="name"
						style={{ padding: '0 .5rem' }}
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una categoría',
							},
						]}
					>
						<Input
							allowClear
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
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
			<Modal
				title="Actualizar categoría"
				
				open={isEditModalOpen}
				onCancel={() => cancelModal()}
				footer={[
					<Button
						key="cancel"
						danger
						onClick={() => {
							cancelModal();
						}}
					>
						Cancelar
					</Button>,
					<Button
						key="delete"
						type="success"
						onClick={handleEditLine}
					>
						Actualizar
					</Button>,
				]}
			>
				<div>{lineBody?.name}</div>
				<Form 
					form={createFormTwo}
					initialValues={{name: lineBody?.name}}
				>
					<Form.Item
						label="Categoría"
						name="name"
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una nueva categoría',
							},
						]}
					>
						<Input
							allowClear
							value={lineBody?.name}
							name="name"
							onChange={(e) => {
								setLineBody((prev) => ({
									...prev,
									[e.target.name]: e.target.value,
								}))
							}
							}
						/>
					</Form.Item>
				</Form>
			</Modal>
			{/* <Loading isLoading={loading} /> */}
		</>
	);
}

