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
	setIsCreateModalOpen,
	selectedBrand,
	setIsDeleteModalOpen,
}) {
	const { setLoading } = useLoadingContext();
	const { addBrand, getBrands, deleteBrand } = useBrandContext();
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
			await deleteBrand(
				item.idBrand,
				selectedBusiness.idSucursal
			);
			setLoading(false);
			message.success('Marca eliminada');
		} catch (error) {
			setLoading(false)
			message.error('Error al eliminar marca');
		}
	};

	return (
		<>
			<Modal
				title="Agregar"
				open={isCreateModalOpen}
				onCancel={handleCloseCreateModal}
				footer={[
					<Button key="cancel" onClick={handleCloseCreateModal}>
						Cancelar
					</Button>,
					<Button
						key="delete"
						type="success"
						onClick={handleCreateBrand}
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
					<Button
						key="cancel"
						onClick={() => setIsDeleteModalOpen(false)}
					>
						Cancelar
					</Button>,
					<Button
						key="delete"
						danger
						type="primary"
						onClick={() => handleDeleteBrand(selectedBrand)}
					>
						Eliminar
					</Button>,
				]}
			>
				<p>
					{`Estas seguro de que deseas eliminar la marca ${selectedBrand?.name}`}
				</p>
			</Modal>
		</>
	);
}
