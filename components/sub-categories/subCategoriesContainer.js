import { useMemo, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Col, Row } from 'antd';
import { addKeys } from '../../util/setKeys';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import SubCategoryFilters from './filters';
import SubCategoryModals from './modals';
import { useLoadingContext } from '../../hooks/useLoadingProvider';
import { Typography } from 'antd';
import Title from '../shared/title';
import { useAuthContext } from '../../context/useUserProfileProvider';
import { PROFILES } from '../shared/profiles';

export default function SubCategoriesContainer() {
	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nameSubFamily',
			key: 1,
			render: (text) => text,
		},
		{
			title: 'Acciones',
			width: '20px',
			key: 2,
			render: (_, item) => (
				<Button
					danger
					type="primary"
					disabled={userProfile == PROFILES.BILLER}
					onClick={() => openDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const { subCategories } = useCategoryContext();
	const { userProfile } = useAuthContext();

	// const [loading, setLoading] = useState(false);
	const { setLoading } = useLoadingContext();

	// list and filter
	const [query, setQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState();

	// delete brand
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [currentBrands, setCurrentBrand] = useState();

	// create
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Filters
	const subCategoryList = useMemo(() => {
		let list = subCategories;
		if (query) {
			list = subCategories.filter((b) =>
				b.nameSubFamily
					.toLowerCase()
					.includes(query.toLocaleLowerCase())
			);
		}
		if (selectedCategory) {
			list = subCategories.filter(
				(b) => b.idProductFamily === selectedCategory
			);
		}
		addKeys(list);
		return list;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, subCategories, selectedCategory]);

	// End Filters

	const handleOpenCreateModal = () => {
		setIsCreateModalOpen(true);
	};

	const openDeleteModal = (value) => {
		setCurrentBrand(value);
		setIsDeleteModalOpen(true);
	};

	return (
		<>
			{/* <Row style={{ alignItems: 'center' }}>
				<Col
					lg={{ offset: 6, span: 12 }}
					md={{ offset: 6, span: 12 }}
					sm={{ offset: 6, span: 12 }}
					xs={{ span: 12 }}
				>
					<Typography>
						<h1
							style={{
								textAlign: 'center',
								fontSize: '1.5rem',
								margin: '0.5rem 0',
							}}
						>
							Sub Categorías
						</h1>
					</Typography>
				</Col>
				<Col
					lg={{ span: 6 }}
					md={{ span: 6 }}
					sm={{ span: 6 }}
					xs={{ span: 12 }}
					style={{
						justifyContent: 'end',
						display: 'flex',
					}}
				></Col>
			</Row> */}
			<Title title="Sub Categorías" goBack={false}>
				{userProfile != PROFILES.BILLER && (
					<Button type="primary" onClick={handleOpenCreateModal}>
						Agregar
					</Button>
				)}
			</Title>
			<SubCategoryFilters
				setQuery={setQuery}
				setSelectedCategory={setSelectedCategory}
			/>
			<Table bordered dataSource={subCategoryList} columns={columns} />
			<SubCategoryModals
				isCreateModalOpen={isCreateModalOpen}
				isDeleteModalOpen={isDeleteModalOpen}
				setIsDeleteModalOpen={setIsDeleteModalOpen}
				setIsCreateModalOpen={setIsCreateModalOpen}
				setLoading={setLoading}
				currentBrands={currentBrands}
			/>
		</>
	);
}
