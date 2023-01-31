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
import { useBrandContext } from '../../../hooks/useBrandsProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';

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
					// onClick={() => handleOpenDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const generalContext = useContext(GeneralContext);
	const { getBrands, brands } = useBrandContext();
	const { selectedBusiness } = useBusinessProvider();

	// const [loading, setLoading] = useState(false);
	const { loading, setLoading } = useLoadingContext()

	const [createForm] = Form.useForm();
	const [searchForm] = Form.useForm();

	useEffect(() => {
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			getBrandsRequest(selectedBusiness.idSucursal);
		}
	}, [selectedBusiness, generalContext]);

	const getCategoriesRequest = async (id) => {
		// setLoading(true);
		// const res = await requestHandler.get(`/api/v2/family/list/${id}`);
		// if (res.isLeft()) {
		// 	return;
		// }
		// setCategories(res.value.getValue().response);
		// setLoading(false);
	};

	const getBrandsRequest = async (id) => {
		try {
			await getBrands(id);
		} catch (error) {
			console.log(error);
			message.error('Error al cargar las marcas');
		}
		// setLoading(true);
		// const res = await requestHandler.get(`/api/v2/subFamily/list/${id}`);
		// if (res.isLeft()) {
		// 	return;
		// }
		// let value = res.value.getValue().response;
		// value = value.filter((b) => b.idStatus === 1);
		// setBrands(value);
		// setLoading(false);
	};

	// const brandsList = useMemo(() => {
	// 	// let list = brands;
	// 	// if (query) {
	// 	// 	list = brands.filter((b) =>
	// 	// 		b.nameSubFamily
	// 	// 			.toLowerCase()
	// 	// 			.includes(query.toLocaleLowerCase())
	// 	// 	);
	// 	// }
	// 	// if (selectedCategory) {
	// 	// 	list = brands.filter((b) => b.idProductFamily === selectedCategory);
	// 	// }
	// 	// return list;
	// }, [brands, query, selectedCategory]);

	// useEffect(() => {
	// 	// console.log(query);
	// 	// console.log(selectedCategory);
	// 	// console.log(brandsList);
	// }, [query, selectedCategory, brandsList]);

	// useEffect(() => {
	// 	// if (generalContext && selectedBusiness) {
	// 	// 	getBrandsRequest(selectedBusiness.idSucursal);
	// 	// 	getCategoriesRequest(selectedBusiness.idSucursal);
	// 	// }
	// 	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [generalContext, selectedBusiness]);

	return (
		<>
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
								// onClick={handleOpenCreateModal}
							>
								Agregar
							</Button>
						</Col>
					</Row>
					{/* <CategoryFilters setQuery={setQuery} /> */}
					<Table bordered columns={columns} />
					<Modal
						// title="Agregar"
						// open={isCreateModalOpen}
						// onOk={handleCreateCategory}
						// onCancel={() => handleCloseCreateModal()}
						footer={[
							<Button
								key="cancel"
								// onClick={() => handleCloseCreateModal()}
							>
								Cancelar
							</Button>,
							<Button
								key="delete"
								type="primary"
								// onClick={handleCreateCategory}
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
									// value={categoryName}
									// onChange={(e) => setCategoryName(e.target.value)}
								/>
							</Form.Item>
						</Form>
					</Modal>
					<Modal
						title="Eliminar"
						// open={isDeleteModalOpen}
						// onCancel={() => setIsDeleteModalOpen(false)}
						footer={[
							<Button
								key="cancel"
								// onClick={() => handleCloseDeleteModal(false)}
							>
								Cancelar
							</Button>,
							<Button
								key="delete"
								danger
								type="primary"
								// onClick={() => handleCloseDeleteModal(true)}
							>
								Eliminar
							</Button>,
						]}
					>
						{/* <p>
					{`Estas seguro de que deseas eliminar la categoría ${currentCategory?.name}`}
				</p> */}
					</Modal>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default BrandsPage;
