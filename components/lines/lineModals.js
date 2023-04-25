import { Input } from 'antd';
import { Form } from 'antd';
import { Select } from 'antd';
import { Button, Modal } from 'antd';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import { BusinessProvider, useBusinessProvider } from '../../hooks/useBusinessProvider';
import { useRequest } from '../../hooks/useRequest';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getLineAndCharacterOfPosition } from 'typescript';

export default function LinesModals({
	isCreateModalOpen,
	isDeleteModalOpen,
	setIsDeleteModalOpen,
	setIsEditModalOpen,
	setIsCreateModalOpen,
	lineToDelete,
	isEditModalOpen,
	createFormTwo,
	closeEditModal
}) {
	
	const { lines, subCategories, addLine, deleteLine, editLines } = useCategoryContext();
	const { requestHandler } = useRequest();
	const { selectedBusiness } = useBusinessProvider();
	const { setLoading } = useLoadingContext();

	const [createForm] = Form.useForm();

	const [lineBody, setLineBody] = useState({
		name: '',
		idSubFamilyFk: ''
	});

	const handleAddLine = async () => {
		try {
			await createForm.validateFields(['name', 'idSubFamilyFk']);
			setLoading(true);
			setIsCreateModalOpen(false)
			await addLine({
				...lineBody,
				idSucursalFk: selectedBusiness.idSucursal,
			});
			setLoading(false);
			message.success('Linea agregada');
		} catch (error) {
			setLoading(false);
			message.error('Error al agregar linea');
		}
	};

	const handleDeleteLine = async () => {
		try {
			setLoading(true);
			setIsDeleteModalOpen(false);
			await deleteLine(lineToDelete.idLine, selectedBusiness.idSucursal);
			message.success('Linea eliminada');
		} catch (error) {
			setLoading(false);
			message.error('Error al eliminar Linea');
		}
		setLoading(false);
	};

	const handleEditLine = async () => {
		try {
			setLoading(true);
			if(lineBody.name == '' || lineBody.idSubFamilyFk == '') {
				message.error('Actualiza la línea')
			} else {				
				setIsEditModalOpen(false);
				await editLines( lineBody.name, lineBody.idSubFamilyFk, lineToDelete, selectedBusiness.idSucursal);
				message.success('Linea actualizada');
			}
		} catch (error) {
			setLoading(false);
			message.error('Error al actualizar Linea');
		} finally {
			setLoading(false);
		}
		
	};

	return (
		<>
			<Modal
				title="Agregar"
				onCancel={() => setIsCreateModalOpen(false)}
				open={isCreateModalOpen}
				onOk={handleAddLine}
				footer={[
					<Button
						key="cancel"
						danger
						onClick={() => setIsCreateModalOpen(false)}
					>
						Cancelar
					</Button>,
					<Button key="delete" type="success" onClick={handleAddLine}>
						Agregar
					</Button>,
				]}
			>
				<Form form={createForm}>
					<Form.Item
						label="Línea"
						name="name"
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una línea',
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
						label="Sub Categoría"
						name="idSubFamilyFk"
						required
						rules={[
							{
								required: true,
								message: 'Elige una sub categoría',
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
							{subCategories &&
								subCategories.map((c) => (
									<Select.Option
										key={c.idProductSubFamily}
										value={c.idProductSubFamily}
									>
										{c.nameSubFamily}
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
						onClick={() => setIsDeleteModalOpen(false)}
					>
						Cancelar
					</Button>,
					<Button
						key="delete"
						danger
						type="primary"
						onClick={() => handleDeleteLine(true)}
					>
						Eliminar
					</Button>,
				]}
			>
				<p>
					{`Estas seguro de que deseas eliminar la linea ${lineToDelete?.name}?`}
				</p>
			</Modal>
			<Modal
				title="Actualizar Línea"
				open={isEditModalOpen}
				onCancel={() => closeEditModal()}
				footer={[
					<Button
						key="cancel"
						danger
						onClick={() => closeEditModal()}
					>
						Cancelar
					</Button>,
					<Button
						key="delete"
						type="success"
						onClick={() => handleEditLine()}
					>
						Actualizar
					</Button>,
				]}
			>
				<Form 
					form={createFormTwo}
					initialValues={{
						name: lineToDelete?.name,
						idSubFamilyFk: parseInt(lineToDelete?.idSubFamilyFk, 10)
					}}
				>
					
					<Form.Item
						label="Línea"
						name="name"
						required
						rules={[
							{
								required: true,
								message: 'Ingresa una nueva línea',
							},
						]}
					>
						<Input
							allowClear
							value={lineToDelete?.name}
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
						label="Subcategoría"
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
							{subCategories &&
								subCategories.map((c) => (
									<Select.Option
										key={c.idProductSubFamily}
										value={c.idProductSubFamily}
									>
										{c.nameSubFamily}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
