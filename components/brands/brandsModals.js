import { Input } from 'antd';
import { Form } from 'antd';
import { Button, Modal } from 'antd';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { useBrandContext } from '../../hooks/useBrandsProvider';
import { useBusinessProvider } from '../../hooks/useBusinessProvider';
import { message } from 'antd';
import { useState } from 'react';

export default function BrandsModals({
	isCreateModalOpen,
	isDeleteModalOpen,
	isEditModalOpen,
	setIsCreateModalOpen,
	setIsEditModalOpen,
	selectedBrand,
	setIsDeleteModalOpen,
	lineBody,
	setLineBody,
	createFormTwo,
	closeEditModal,
}) {
	const { setLoading } = useLoadingContext();
	const { addBrand, getBrands, deleteBrand, updateBrand } = useBrandContext();
	const { selectedBusiness } = useBusinessProvider();

	const [createForm] = Form.useForm();

	const [brandName, setBrandName] = useState('');

	const handleCloseCreateModal = async () => {
		setIsCreateModalOpen(false);
		createForm.resetFields();
	};

	const handleCreateBrand = async () => {
		await createForm.validateFields(['name']);
		await createBrand(brandName);
	};

	const createBrand = async (value) => {
		try {
			setLoading(true);
			handleCloseCreateModal();
			await addBrand(value, selectedBusiness.idSucursal);
			await getBrands(selectedBusiness.idSucursal);
			setLoading(false);
			message.success('Marca agregada');
		} catch (error) {
			message.error('Error al agregar marca');
		}
	};

	const handleDeleteBrand = async (item) => {
		try {
			setLoading(true);
			setIsDeleteModalOpen(false);
			await deleteBrand(item.idBrand, selectedBusiness.idSucursal);
			setLoading(false);
			message.success('Marca eliminada');
		} catch (error) {
			setLoading(false);
			message.error('Error al eliminar marca');
		}
	};

	const handleEditLine = async () => {
		try {
			setLoading(true);
			setIsEditModalOpen(false);
			await updateBrand(
				lineBody.name,
				lineBody.idBrand,
				selectedBusiness.idSucursal
			);
			message.success('Marca actualizada');
		} catch (error) {
			setLoading(false);
			message.error('Error al actualizar marca');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Modal
				title="Agregar"
				open={isCreateModalOpen}
				onCancel={handleCloseCreateModal}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button danger key="cancel" onClick={handleCloseCreateModal}>
							Cancelar
						</Button>
						,
						<Button key="delete" type="success" onClick={handleCreateBrand}>
							Agregar
						</Button>
						,
					</div>,
				]}
			>
				<Form form={createForm}>
					<Form.Item
						label="Marca"
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
							value={brandName}
							onChange={(e) => setBrandName(e.target.value)}
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="Eliminar"
				open={isDeleteModalOpen}
				onCancel={() => setIsDeleteModalOpen(false)}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
							Cancelar
						</Button>
						<Button
							key="delete"
							danger
							type="primary"
							onClick={() => handleDeleteBrand(selectedBrand)}
						>
							Eliminar
						</Button>
					</div>,
				]}
			>
				<p>
					{`Estas seguro de que deseas eliminar la marca ${selectedBrand?.name}`}
				</p>
			</Modal>
			<Modal
				title="Actualizar marca"
				open={isEditModalOpen}
				onCancel={() => closeEditModal()}
				footer={[
					// eslint-disable-next-line react/jsx-key
					<div className="flex justify-end gap-6">
						<Button danger key="cancel" onClick={() => closeEditModal()}>
							Cancelar
						</Button>
						<Button
							key="delete"
							type="primary"
							onClick={() => handleEditLine()}
						>
							Aceptar
						</Button>
					</div>,
				]}
			>
				<Form
					form={createFormTwo}
					initialValues={{
						name: lineBody.name,
					}}
				>
					<Form.Item
						label="Marca"
						name="name"
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una nueva marca',
							},
						]}
					>
						<Input
							allowClear
							value={lineBody.idBrand}
							name="name"
							onChange={(e) =>
								setLineBody((prev) => ({
									...prev,
									[e.target.name]: e.target.value,
								}))
							}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
