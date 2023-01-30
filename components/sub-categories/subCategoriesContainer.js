import { useMemo, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Col, Row } from 'antd';
import { addKeys } from '../../util/setKeys';
import { useCategoryContext } from '../../hooks/useCategoriesProvider';
import SubCategoryFilters from './filters';
import SubCategoryModals from './modals';
import Loading from '../loading';

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
			key: 2,
			render: (_, item) => (
				<Button
					danger
					type="primary"
					onClick={() => openDeleteModal(item)}
				>
					<DeleteOutlined />
				</Button>
			),
		},
	];

	const { subCategories } = useCategoryContext();

	const [loading, setLoading] = useState(false);

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
	}, [query, subCategories, selectedCategory ]);

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
			<Row style={{ alignItems: 'center' }}>
				<Col offset={6} span={12}>
					<h1
						style={{
							textAlign: 'center',
							fontSize: '2rem',
							color: '#fff',
						}}
					>
						Sub Categorías
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
						onClick={handleOpenCreateModal}
					>
						Agregar
					</Button>
				</Col>
			</Row>
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
			<Loading isLoading={loading} />
		</>
	);
}
