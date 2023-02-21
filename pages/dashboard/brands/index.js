import { useContext, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../components/shared/layout';
import { GeneralContext } from '../../_app';
import { useBusinessProvider } from '../../../hooks/useBusinessProvider';
import Loading from '../../../components/shared/loading';
import { Button, Col, Row, Table, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useBrandContext } from '../../../hooks/useBrandsProvider';
import { useLoadingContext } from '../../../hooks/useLoadingProvider';
import BrandsFilters from '../../../components/brands/brandsFilters';
import BrandsModals from '../../../components/brands/brandsModals';
import { addKeys } from '../../../util/setKeys';
import { Typography } from 'antd';
import { PROFILES } from '../../../components/shared/profiles';
import { useAuthContext } from '../../../context/useUserProfileProvider';
import Title from '../../../components/shared/title';

const BrandsPage = () => {
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
			width: '20px',
			render: (_, item) => (
				<Button
					danger
					type="primary"
					disabled={userProfile == PROFILES.BILLER}
					onClick={() => handleOpenDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const generalContext = useContext(GeneralContext);
	const { getBrands, brands } = useBrandContext();
	const { selectedBusiness } = useBusinessProvider();
	const { userProfile } = useAuthContext();

	// const [loading, setLoading] = useState(false);
	const { loading } = useLoadingContext();

	// Create Modal
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Delete Modal
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState();

	// Filters
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

	//Modals
	// -> Create

	// -> Delete
	const handleOpenDeleteModal = (value) => {
		setSelectedBrand(value);
		setIsDeleteModalOpen(true);
	};

	// End Modals

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
					<Title title="Marcas">
						{userProfile != PROFILES.BILLER && (
							<Button
								type="primary"
								onClick={handleOpenCreateModal}
							>
								Agregar
							</Button>
						)}
					</Title>
					<BrandsFilters setQuery={setQuery} />
					<Table bordered dataSource={brandsList} columns={columns} />
					<BrandsModals
						isCreateModalOpen={isCreateModalOpen}
						isDeleteModalOpen={isDeleteModalOpen}
						setIsCreateModalOpen={setIsCreateModalOpen}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
						selectedBrand={selectedBrand}
					/>
				</div>
			</DashboardLayout>
			<Loading isLoading={loading} />
		</>
	);
};

export default BrandsPage;
