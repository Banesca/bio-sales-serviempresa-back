import { useContext, useEffect, useState } from 'react';
import { Table, Space, Modal, ConfigProvider, Empty, Form, Input } from 'antd';
import Button from 'antd-button-color';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeTwoTone,
} from '@ant-design/icons';

import DashboardLayout from '../../../components/shared/layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GeneralContext } from '../../_app';
import { addKeys } from '../../../util/setKeys';
import SelectBusiness from '../../../components/business/selectBusiness';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import { message } from 'antd';
import Filter from './Filter/Filter';
import { useProductFilter } from '../../../components/products/useProductFilter';
import Loading from '../../../components/shared/loading';
import { useCategoryContext } from '../../../hooks/useCategoriesProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import { useProducts } from '../../../components/products/hooks/useProducts';
import { useBrandContext } from '../../../hooks/useBrandsProvider';
import Title from '../../../components/shared/title';
import { PROFILES } from '../../../components/shared/profiles';
import { useAuthContext } from '../../../context/useUserProfileProvider';

export default function Products() {
	const router = useRouter();
	const columns = [
		{
			title: 'ID',
			dataIndex: 'idProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Nombre',
			dataIndex: 'nameProduct',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Código',
			dataIndex: 'barCode',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Familia',
			dataIndex: 'nameFamily',
			responsive: ['lg'],
			key: 4,
			render: (text) => <p>{text ? text : 'Indefinida'}</p>,
		},
		{
			title: 'Subfamilia',
			dataIndex: 'nameSubFamily',
			responsive: ['lg'],
			key: 6,
			render: (text) => <p>{text ? text : 'Indefinida'}</p>,
		},
		{
			title: 'Precio Compra',
			dataIndex: 'pricePurchase',
			key: 3,
			render: (text) => <p>${text}</p>
		},
		{
			title: 'Precio venta',
			dataIndex: 'priceSale',
			key: 3,
			render: (text) => <p>${text}</p>
		},
		{
			title: 'Stock mínimo',
			dataIndex: 'minStock',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Valor total',
			dataIndex: 'totalPrice',
			responsive: ['sm'],
			key: 2,
			render: (text) => <p>${text}</p>,
		},
		{
			title: 'Stock',
			dataIndex: 'stock',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Unidad de medida',
			responsive: ['xs'],
			dataIndex: 'idUnidadMedida',
			key: 1,
			render: (text) => <p>{text}</p>,
		},
		{
			title: 'Acciones',
			align: 'center',
			key: 6,
			render: (product, index) => (
				<Space size="small" style={{justifyContent: 'center', display: 'flex'}}>
					<Button
						onClick={() => {
							openEditModal(product)
						}}
					>
						<EditOutlined />
					</Button>
				</Space>
			),
		},
	];
	const { loading, setLoading } = useLoadingContext();

	const generalContext = useContext(GeneralContext);

	const { updateProductInv, productsInv, getProductsInv } = useProducts();
	const { clean, filtered, setProduct, setQuery } = useProductFilter();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [createForm] = Form.useForm();

	const [object, setObject] = useState();
	

	const [lineBody, setLineBody] = useState({
		counter: '',
	});
	const [lineBodys, setLineBodys] = useState({
		reference: '',
	});

	useEffect(() => {
		let list = productsInv;
		addKeys(list);
		setProduct(list);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productsInv]);

	const getProductsRequest = async (businessId) => {
		setLoading(true);
		try {
			await getProductsInv(businessId);
		} catch (error) {
			console.error(error);
			message.error('Error al obtener inventario');
		} finally {
			setLoading(false);
		}
	};


	const openEditModal = (value) => {
		setIsEditModalOpen(true);
		setObject(value);
	}

	const handleUpdateStock = async () => {
		try {
			setLoading(true);
			setIsEditModalOpen(false);
			await updateProductInv(object.idProduct, lineBody.undefined, lineBodys.undefined, selectedBusiness.idSucursal);
			message.success('Stock actualizado');
		} catch (error) {
			message.error('Error al cargar marcas');
		} finally {
			setLoading(false);
		}
	}



	const { selectedBusiness } = useBusinessProvider();

	useEffect(() => {
		// request data
		setLoading(true);
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			getProductsRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [generalContext, selectedBusiness]);

	// Delete Modal

	// which modal component

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
					<Title goBack={false} title={'Inventario'}>
						<Button
							type="warning"
							style={{marginRight: '-2.3rem'}}
							onClick={() =>
								router.push('/dashboard/stock/imp')
							}
						>
							Importar
						</Button>
					</Title>
					<Filter setQuery={setQuery} clean={clean} />
					<ConfigProvider renderEmpty={customizeRenderEmpty}>
						<Table
							columns={columns}
							dataSource={filtered()}
							loading={loading}
						/>
					</ConfigProvider>
				</div>
				<Modal
					title="Ajustar inventario"
					open={isEditModalOpen}
					onCancel={() => setIsEditModalOpen(false)}
					footer={[
						<Button
							key="cancel"
							danger
							onClick={() => setIsEditModalOpen(false)}
						>
							Cancelar
						</Button>,
						<Button
							key="delete"
							type="primary"
							onClick={() => handleUpdateStock()}
						>
							Aceptar
						</Button>,
					]}
				>
					<Form form={createForm}>
						<Form.Item
							label="Cantidad a ajustar"
							name="counter"
							required
							rules={[
								{
									required: true,
									message: 'Ingresa la cantidad que desee cambiar',
								},
							]}
						>
							<Input
								allowClear
								value={lineBody}
								name="counter"
								onChange={(e) =>
									setLineBody((prev) => ({
										...prev,
										[e.target.counter]: e.target.value,
									}))
								}
							/>
						</Form.Item>
						<Form.Item
							label="Motivo"
							name="reference"
							required
							rules={[
								{
									required: true,
									message: 'Motivo',
								},
							]}
						>
							<Input
								allowClear
								value={lineBodys}
								name="reference"
								onChange={(e) =>
									setLineBodys((prev) => ({
										...prev,
										[e.target.reference]: e.target.value,
									}))
								}
							/>
						</Form.Item>
					</Form>
				</Modal>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
}