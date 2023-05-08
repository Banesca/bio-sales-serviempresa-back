import { useContext, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import { Button, Table, message, ConfigProvider, Space, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useBrandContext } from '../../../hooks/useBrandsProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import BrandsFilters from '../../../components/brands/brandsFilters';
import BrandsModals from '../../../components/brands/brandsModals';
import { addKeys } from '../../../util/setKeys';
import { PROFILES } from '../../../components/shared/profiles';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import Title from '../../../components/shared/title';
import { CustomizeRenderEmpty } from '../../../components/common/customizeRenderEmpty';

const BrandsPage = () => {
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
			width: '20px',
			render: (_, item) => (
				<Space>
					<Button
						disabled={log == PROFILES.BILLER}
						onClick={() => openEditModal(item)}
					>
						<EditOutlined />
					</Button>
					<Button
						danger
						type="primary"
						disabled={log == PROFILES.BILLER}
						onClick={() => handleOpenDeleteModal(item)}
					>
						<DeleteOutlined />
					</Button>
				</Space>
			),
		},
	];

	const generalContext = useContext(GeneralContext);
	const { getBrands, brands } = useBrandContext();
	const { selectedBusiness } = useBusinessProvider();
	const { userProfile } = useAuthContext();
	const [createFormTwo] = Form.useForm();

	const { loading } = useLoadingContext();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState();
	const [query, setQuery] = useState('');

	useEffect(() => {
		if (
			Object.keys(generalContext).length > 0 &&
			Object.keys(selectedBusiness).length > 0
		) {
			getBrandsRequest(selectedBusiness.idSucursal);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBusiness, generalContext]);

	const getBrandsRequest = async (id) => {
		try {
			await getBrands(id);
		} catch (error) {
			message.error('Error al cargar las marcas');
		}
	};

	const handleOpenDeleteModal = (value) => {
		setSelectedBrand(value);
		setIsDeleteModalOpen(true);
	};

	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const brandsList = useMemo(() => {
		let list = brands;
		if (query) {
			list = brands.filter((b) =>
				b.name.toLowerCase().includes(query.toLocaleLowerCase())
			);
		}
		addKeys(list);
		return list;
	}, [brands, query]);

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [lineBody, setLineBody] = useState({
		name: '',
		idB: '',
	});

	const openEditModal = (value) => {
		setIsEditModalOpen(true);
		setLineBody(value);
		setTimeout(() => {
			createFormTwo.resetFields();
		}, 100);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		createFormTwo.resetFields();
	};

	return (
		<>
			<DashboardLayout>
				<div className="m-4 p-4">
					<Title title="Marcas">
						{log != PROFILES.BILLER && (
							<Button
								type="success"
								style={{ marginRight: '-2.3rem' }}
								onClick={handleOpenCreateModal}
							>
								Agregar
							</Button>
						)}
					</Title>
					<ConfigProvider renderEmpty={CustomizeRenderEmpty}>
						<BrandsFilters setQuery={setQuery} />
						<Table bordered dataSource={brandsList} columns={columns} />
						<BrandsModals
							isCreateModalOpen={isCreateModalOpen}
							isDeleteModalOpen={isDeleteModalOpen}
							setIsCreateModalOpen={setIsCreateModalOpen}
							setIsDeleteModalOpen={setIsDeleteModalOpen}
							selectedBrand={selectedBrand}
							isEditModalOpen={isEditModalOpen}
							lineBody={lineBody}
							setLineBody={setLineBody}
							setIsEditModalOpen={setIsEditModalOpen}
							createFormTwo={createFormTwo}
							closeEditModal={closeEditModal}
						/>
					</ConfigProvider>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default BrandsPage;
