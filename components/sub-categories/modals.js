import { Input } from 'antd';
import { Select } from 'antd';
import { Form } from 'antd';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { message } from 'antd';
import { useRequest } from '../../hooks/useRequest';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';

export default function SubCategoryModals({
	isCreateModalOpen,
	isDeleteModalOpen,
	isEditModalOpen,
	setIsDeleteModalOpen,
	setIsCreateModalOpen,
	setIsEditModalOpen,
	setLoading,
	currentBrands,
	createFormTwo,
	close,
}) {
	const {
		categories,
		deleteSubCategory,
		addSubCategory,
		getSubCategories,
		editSubCategories,
	} = useCategoryContext();
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();

	const [lineBody, setLineBody] = useState({
		name: '',
		idSubFamilyFk: '',
	});

	const [modals, setModals] = useState({
		add: isCreateModalOpen,
		delete: isDeleteModalOpen,
	});
	const [subCategoryName, setSubCategoryName] = useState('');
	const [createCategory, setCreateCategory] = useState(null);
	const [createForm] = Form.useForm();

	useEffect(() => {
		setModals({
			add: isCreateModalOpen,
			delete: isDeleteModalOpen,
		});
	}, [isCreateModalOpen, isDeleteModalOpen]);

	const handleDelete = async (id) => {
		try {
			await deleteSubCategory(id, selectedBusiness.idSucursal);
			await getSubCategories(selectedBusiness.idSucursal);
			setLoading(false);
			message.success('Sub categoría eliminada');
		} catch (error) {
			message.error('Error al eliminar sub categoría');
		}
	};

	const closeDeleteModal = async (bool) => {
		setLoading(true);
		setIsDeleteModalOpen(false);
		if (bool) {
			await handleDelete(currentBrands.idProductSubFamily);
		} else {
			setLoading(false);
		}
	};
	const addSubCategoryRequest = async () => {
		setLoading(true);
		try {
			const data = new FormData();
			data.append('nameSubFamily', subCategoryName);
			data.append('order', 0);
			data.append('image', null);
			data.append('idSucursalFk', selectedBusiness?.idSucursal);
			data.append('idProductFamilyFk', createCategory);
			await addSubCategory(data, selectedBusiness.idSucursal);
			message.success('Sub categoría agregada');
		} catch (error) {
			message.error('Error al eliminar sub categoría');
		}
	};

	const validateBrandName = async () => {
		const res = await requestHandler.post('/api/v2/subfamily/find/name', {
			nameSubFamily: subCategoryName,
			idSucursalFk: selectedBusiness.idSucursal,
		});
		const value = res.value.getValue();
		return !!value.data;
	};

	const handleAddSubCategory = async () => {
		try {
			await createForm.validateFields(['idFamily', 'nameSubFamily']);
		} catch (error) {
			return setLoading(false);
		}
		try {
			const invalidBrand = await validateBrandName();
			if (invalidBrand) {
				setLoading(false);
				return message.error(`La subcategoría ${subCategoryName} ya existe`);
			}
			setIsCreateModalOpen(false);
			createForm.resetFields();
			await addSubCategoryRequest();
			setLoading(false);
		} catch (error) {
			setIsCreateModalOpen(false);
			setLoading(false);
			return message.error('Error al agregar sub categoría');
		}
	};

	const handleCloseCreateModal = async () => {
		setIsCreateModalOpen(false);
		createForm.resetFields();
	};

	const handleEditLine = async () => {
		try {
			setLoading(true);
			setIsEditModalOpen(false);
			await editSubCategories(
				lineBody.idSubFamilyFk,
				lineBody.name,
				currentBrands.idStatus,
				currentBrands.idProductSubFamily,
				selectedBusiness.idSucursal
			);
			message.success('Subcategoria actualizada');
		} catch (error) {
			setLoading(false);
			message.error('Error al actualizar subcategoria');
		} finally {
			setLoading(false);
			createFormTwo.resetFields();
		}
	};

	return (
		<>
			<Modal
				title="Agregar"
				onCancel={() => handleCloseCreateModal()}
				open={modals.add}
				onOk={handleAddSubCategory}
				footer={[
					<Button key="cancel" danger onClick={() => handleCloseCreateModal()}>
						Cancelar
					</Button>,
					<Button key="delete" type="success" onClick={handleAddSubCategory}>
						Agregar
					</Button>,
				]}
			>
				<Form form={createForm}>
					<Form.Item
						label="Subcategoría"
						name="nameSubFamily"
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una subcategoría',
							},
						]}
					>
						<Input
							allowClear
							value={subCategoryName}
							onChange={(e) => setSubCategoryName(e.target.value)}
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
							allowClear
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
				open={modals.delete}
				onCancel={() => setIsDeleteModalOpen(false)}
				footer={[
					<Button key="cancel" onClick={() => closeDeleteModal(false)}>
						Cancelar
					</Button>,
					<Button
						key="delete"
						danger
						type="primary"
						onClick={() => closeDeleteModal(true)}
					>
						Eliminar
					</Button>,
				]}
			>
				<p>
					{`Estas seguro de que deseas eliminar la sub categoría ${currentBrands?.nameSubFamily}`}
				</p>
			</Modal>
			<Modal
				title="Actualizar subcategoria"
				open={isEditModalOpen}
				onCancel={() => close}
				footer={[
					<Button key="cancel" danger onClick={() => close()}>
						Cancelar
					</Button>,
					<Button key="delete" type="success" onClick={() => handleEditLine()}>
						Actualizar
					</Button>,
				]}
			>
				<Form
					form={createFormTwo}
					initialValues={{
						name: currentBrands?.nameSubFamily,
						idSubFamilyFk: currentBrands?.idProductFamilyFk,
					}}
				>
					<Form.Item
						label="Subcategoría"
						name="name"
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una nueva subcategoría',
							},
						]}
					>
						<Input
							allowClear
							value={lineBody}
							name="name"
							onChange={(e) =>
								setLineBody((prev) => ({
									...prev,
									[e.target.name]: e.target.value,
								}))
							}
						/>
					</Form.Item>
					<Form.Item
						label="Categoría"
						name="idSubFamilyFk"
						required
						rules={[
							{
								required: true,
								message: 'Elige una subcategoría',
							},
						]}
					>
						<Select
							value={lineBody.idSubFamilyFk}
							onChange={(value) =>
								setLineBody((prev) => ({
									...prev,
									idSubFamilyFk: value,
								}))
							}
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
		</>
	);
}
